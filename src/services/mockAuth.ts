interface StationDetails {
  stationName?: string;
  stationOwnerName?: string;
  proofType?: string;
  idProofNo?: string;
  stationRegistrationNumber?: string;
  contactNo?: string;
  // email is already part of User interface
  address?: string;
  geoLatitude?: string;
  geoLongitude?: string;
  operatingHours?: string;
  kycFileName?: string; // Store filename or a reference
  // In a real app, KYC file would be handled via blob storage / file server
}

interface User extends StationDetails {
  id: string;
  username: string; // This can be the primary identifier: username, email, or phone
  password: string;
  fullName?: string; 
  email?: string;    // Dedicated email, especially if identifier is username/phone
  createdAt: Date;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  isNewUser?: boolean;
}

interface RegistrationDetails extends StationDetails {
    fullName: string;
    emailToRegister?: string;
}


class MockAuthService {
  private users: User[] = [];
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async checkUserExists(identifier: string): Promise<boolean> {
    await this.delay(300);
    const normalizedIdentifier = identifier.toLowerCase();
    return this.users.some(
      user => user.username.toLowerCase() === normalizedIdentifier || 
              (user.email && user.email.toLowerCase() === normalizedIdentifier)
    );
  }

  async authenticateOrRegister(
    identifier: string,
    password: string,
    registrationDetails?: RegistrationDetails
  ): Promise<AuthResponse> {
    await this.delay(1000);

    if (!identifier.trim() || !password.trim()) {
      return { success: false, message: 'Identifier and password are required' };
    }
    if (identifier.length < 3) {
      return { success: false, message: 'Identifier must be at least 3 characters long' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }

    const normalizedIdentifier = identifier.toLowerCase();
    const existingUser = this.users.find(
      user => user.username.toLowerCase() === normalizedIdentifier ||
              (user.email && user.email.toLowerCase() === normalizedIdentifier)
    );

    if (existingUser && !registrationDetails) { // Attempting login
      if (existingUser.password === password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = existingUser;
        return {
          success: true,
          message: 'Login successful! Welcome back.',
          user: userWithoutPassword,
          isNewUser: false,
        };
      } else {
        return { success: false, message: 'Invalid password' };
      }
    } else if (!existingUser && registrationDetails) { // Attempting registration
      const { 
        fullName, emailToRegister,
        stationName, stationOwnerName, proofType, idProofNo,
        stationRegistrationNumber, contactNo, address,
        geoLatitude, geoLongitude, operatingHours, kycFileName
      } = registrationDetails;

      if (!fullName) {
        return { success: false, message: 'Full name is required for new account.' };
      }
      // Mandatory station fields for signup
      if (!stationName || !stationOwnerName || !proofType || !idProofNo || !stationRegistrationNumber || !contactNo || !address) {
        return { success: false, message: "Please fill all mandatory station details."};
      }
      
      let finalEmail = emailToRegister;
      if (!finalEmail && identifier.includes('@') && /\S+@\S+\.\S+/.test(identifier)) {
        finalEmail = identifier;
      }

      if (!finalEmail || !/\S+@\S+\.\S+/.test(finalEmail)) { // Ensure finalEmail is valid
         return { success: false, message: 'A valid email is required for new account.' };
      }
      
      if (this.users.some(u => u.email && u.email.toLowerCase() === finalEmail!.toLowerCase() && u.username.toLowerCase() !== normalizedIdentifier)) {
        return { success: false, message: 'This email is already associated with another account.' };
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: identifier,
        password,
        fullName,
        email: finalEmail,
        createdAt: new Date(),
        // Station details
        stationName,
        stationOwnerName,
        proofType,
        idProofNo,
        stationRegistrationNumber,
        contactNo,
        address,
        geoLatitude,
        geoLongitude,
        operatingHours,
        kycFileName,
      };
      this.users.push(newUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = newUser;
      return {
        success: true,
        message: 'Account created successfully! You are now logged in.',
        user: userWithoutPassword,
        isNewUser: true,
      };
    } else if (existingUser && registrationDetails) {
        return { success: false, message: 'This user already exists. Try logging in.'};
    } else { 
        return { success: false, message: 'User not found. Would you like to create an account?' };
    }
  }

  getUserCount(): number {
    return this.users.length;
  }

  getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(user => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = user;
        return rest;
    });
  }
}

export const mockAuthService = new MockAuthService();
export type { AuthResponse, User, RegistrationDetails };
