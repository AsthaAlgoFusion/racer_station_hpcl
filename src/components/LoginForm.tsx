import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { mockAuthService, type AuthResponse, type RegistrationDetails } from '@/services/mockAuth';
import { Loader2, Eye, EyeOff, UploadCloud } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type FormMode = 'login' | 'signup';

const baseSchema = z.object({
  identifier: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signupSpecificSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  emailForRegistration: z.string().email("Invalid email address."), 
  // Station fields
  stationName: z.string().min(3, "Station Name is required."),
  stationOwnerName: z.string().min(3, "Owner Name is required."),
  proofType: z.string({ required_error: "Proof type is required." }).min(1, "Proof type is required."),
  idProofNo: z.string().min(3, "ID Proof No. is required."),
  stationRegistrationNumber: z.string().min(3, "Registration No. is required."),
  contactNo: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format. (e.g., +12223334444 or 2223334444)"),
  address: z.string().min(10, "Address is required (min 10 characters)."),
  geoLatitude: z.string().optional(),
  geoLongitude: z.string().optional(),
  operatingHours: z.string().optional(),
  kycFile: z.instanceof(FileList).optional()
    .refine(files => !files || files.length === 0 || files.length === 1, "Only one file can be uploaded for KYC.")
    .refine(files => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
    .refine(files => !files || files.length === 0 || ['application/pdf', 'image/jpeg', 'image/png'].includes(files[0].type), 'Only .pdf, .jpg, .png files are accepted.')
});

const formSchema = z.discriminatedUnion("formMode", [
  baseSchema.extend({ formMode: z.literal("login") }),
  baseSchema.extend({ formMode: z.literal("signup") }).merge(signupSpecificSchema)
]);

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onAuthSuccess: (response: AuthResponse) => void;
}

export default function LoginForm({ onAuthSuccess }: LoginFormProps) {
  const [formMode, setFormMode] = useState<FormMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedKycFileName, setSelectedKycFileName] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formMode: 'login',
      identifier: '',
      password: '',
    },
  });

  useEffect(() => {
    form.reset({
      formMode, 
      identifier: '',
      password: '',
      fullName: '',
      emailForRegistration: '',
      stationName: '',
      stationOwnerName: '',
      proofType: undefined,
      idProofNo: '',
      stationRegistrationNumber: '',
      contactNo: '',
      address: '',
      geoLatitude: '',
      geoLongitude: '',
      operatingHours: '',
      kycFile: undefined,
    });
    setFormError(null);
    setSelectedKycFileName(null);
  }, [formMode, form]);
  
  useEffect(() => {
    form.setValue('formMode', formMode);
  }, [formMode, form]);


  const onSubmit = async (data: FormValues) => {
    setFormError(null);
    setIsLoading(true);

    try {
      let response: AuthResponse;
      if (data.formMode === 'login') {
        response = await mockAuthService.authenticateOrRegister(data.identifier, data.password);
      } else { 
        let finalEmail = data.emailForRegistration;
        if (data.identifier.includes('@') && /\S+@\S+\.\S+/.test(data.identifier)) {
            finalEmail = data.identifier; 
        } else if (!finalEmail || !/\S+@\S+\.\S+/.test(finalEmail)) { 
            setFormError('A valid email address is required for signup.');
            setIsLoading(false);
            toast.error('A valid email address is required for signup.');
            return;
        }

        const registrationPayload: RegistrationDetails = {
          fullName: data.fullName!,
          emailToRegister: finalEmail,
          stationName: data.stationName!,
          stationOwnerName: data.stationOwnerName!,
          proofType: data.proofType!,
          idProofNo: data.idProofNo!,
          stationRegistrationNumber: data.stationRegistrationNumber!,
          contactNo: data.contactNo!,
          address: data.address!,
          geoLatitude: data.geoLatitude,
          geoLongitude: data.geoLongitude,
          operatingHours: data.operatingHours,
          kycFileName: data.kycFile && data.kycFile.length > 0 ? data.kycFile[0].name : undefined,
        };
        response = await mockAuthService.authenticateOrRegister(data.identifier, data.password, registrationPayload);
      }

      if (response.success) {
        toast.success(response.message);
        onAuthSuccess(response);
      } else {
        setFormError(response.message);
        toast.error(response.message);
      }
    } catch (err) {
      const generalErrorMessage = data.formMode === 'login' ? 'Login failed. Please try again.' : 'Signup failed. Please try again.';
      setFormError(generalErrorMessage);
      toast.error('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputBaseClass = "h-12 text-base px-4 rounded-lg border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-400 dark:placeholder:text-slate-500";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  const getTitleAndDescription = () => {
    if (formMode === 'login') {
      return { title: 'Welcome back', description: 'Login to your HP account' };
    }
    return { title: 'Create an account', description: 'Join HP by filling out your details' };
  };

  const { title, description } = getTitleAndDescription();
  const mainButtonText = formMode === 'login' ? 'Login' : 'Sign up';
  
  const handleKycFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedKycFileName(files[0].name);
      form.setValue('kycFile', files, { shouldValidate: true });
    } else {
      setSelectedKycFileName(null);
      form.setValue('kycFile', undefined, { shouldValidate: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-950 p-4 selection:bg-purple-500 selection:text-white">
      <div className={`w-full ${formMode === 'signup' ? 'max-w-3xl' : 'max-w-md'} bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden transition-all duration-300`}>
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
          
          {formError && <p id="form-error" className="mb-4 text-red-600 dark:text-red-400 text-sm p-3 bg-red-100 dark:bg-red-900/30 rounded-md text-center" role="alert">{formError}</p>}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formMode === 'login' && (
              <>
                <div>
                  <Label htmlFor="identifier-login" className={labelClass}>Username or Email</Label>
                  <Input id="identifier-login" type="text" placeholder="Enter your username or email" className={inputBaseClass} {...form.register('identifier')} />
                  {form.formState.errors.identifier && <p className="text-xs text-red-500 mt-1">{form.formState.errors.identifier.message}</p>}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <Label htmlFor="password-login" className={`${labelClass} mb-0`}>Password</Label>
                    <button type="button" className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:underline">
                      Forgot your password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input id="password-login" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className={`${inputBaseClass} pr-12`} {...form.register('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {form.formState.errors.password && <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>}
                </div>
              </>
            )}

            {formMode === 'signup' && (
              <>
                {/* User Details: Username, Full Name, Email, Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                  <div>
                    <Label htmlFor="identifier-signup" className={labelClass}>Username <span className="text-xs text-gray-500">(or Email)</span> *</Label>
                    <Input id="identifier-signup" type="text" placeholder="Username or Email" className={inputBaseClass} {...form.register('identifier')} />
                    {form.formState.errors.identifier && <p className="text-xs text-red-500 mt-1">{form.formState.errors.identifier.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="fullName" className={labelClass}>Full Name *</Label>
                    <Input id="fullName" type="text" placeholder="Full Name" className={inputBaseClass} {...form.register('fullName')} />
                    {form.formState.errors.fullName && <p className="text-xs text-red-500 mt-1">{form.formState.errors.fullName.message}</p>}
                  </div>
                  {!(form.watch('identifier', '').includes('@') && /\S+@\S+\.\S+/.test(form.watch('identifier', ''))) && (
                    <div>
                        <Label htmlFor="emailForRegistration" className={labelClass}>Email Address *</Label>
                        <Input id="emailForRegistration" type="email" placeholder="Email Address" className={inputBaseClass} {...form.register('emailForRegistration')} />
                        {form.formState.errors.emailForRegistration && <p className="text-xs text-red-500 mt-1">{form.formState.errors.emailForRegistration.message}</p>}
                    </div>
                  )}
                  <div className={`${(form.watch('identifier', '').includes('@') && /\S+@\S+\.\S+/.test(form.watch('identifier', ''))) ? 'lg:col-span-2' : ''}`}> {/* Adjust span if email field is hidden */}
                    <Label htmlFor="password-signup" className={labelClass}>Password *</Label>
                    <div className="relative">
                        <Input id="password-signup" type={showPassword ? 'text' : 'password'} placeholder="Create Password" className={`${inputBaseClass} pr-12`} {...form.register('password')} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200" aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {form.formState.errors.password && <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>}
                  </div>
                </div>
                
                {/* Station Details Fields - No explicit heading or top border */}
                {/* Station Details 1: Station Name, Owner, Proof, ID, Reg No, Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                    <div>
                        <Label htmlFor="stationName" className={labelClass}>Station Name *</Label>
                        <Input id="stationName" placeholder="Station Name" className={inputBaseClass} {...form.register('stationName')} />
                        {form.formState.errors.stationName && <p className="text-xs text-red-500 mt-1">{form.formState.errors.stationName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="stationOwnerName" className={labelClass}>Owner Name *</Label>
                        <Input id="stationOwnerName" placeholder="Owner Name" className={inputBaseClass} {...form.register('stationOwnerName')} />
                        {form.formState.errors.stationOwnerName && <p className="text-xs text-red-500 mt-1">{form.formState.errors.stationOwnerName.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="proofType" className={labelClass}>Proof Type *</Label>
                        <Controller name="proofType" control={form.control} render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className={inputBaseClass}><SelectValue placeholder="Select proof" /></SelectTrigger>
                                <SelectContent className="dark:bg-slate-800"><SelectItem value="aadhar">Aadhar</SelectItem><SelectItem value="pan">PAN</SelectItem><SelectItem value="driving_license">Driving License</SelectItem><SelectItem value="passport">Passport</SelectItem><SelectItem value="voter_id">Voter ID</SelectItem></SelectContent>
                            </Select>
                        )} />
                        {form.formState.errors.proofType && <p className="text-xs text-red-500 mt-1">{form.formState.errors.proofType.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="idProofNo" className={labelClass}>ID Proof No. *</Label>
                        <Input id="idProofNo" placeholder="ID Proof Number" className={inputBaseClass} {...form.register('idProofNo')} />
                        {form.formState.errors.idProofNo && <p className="text-xs text-red-500 mt-1">{form.formState.errors.idProofNo.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="stationRegistrationNumber" className={labelClass}>Station Reg. No. *</Label>
                        <Input id="stationRegistrationNumber" placeholder="Registration Number" className={inputBaseClass} {...form.register('stationRegistrationNumber')} />
                        {form.formState.errors.stationRegistrationNumber && <p className="text-xs text-red-500 mt-1">{form.formState.errors.stationRegistrationNumber.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="contactNo" className={labelClass}>Contact No. *</Label>
                        <Input id="contactNo" type="tel" placeholder="Contact Number" className={inputBaseClass} {...form.register('contactNo')} />
                        {form.formState.errors.contactNo && <p className="text-xs text-red-500 mt-1">{form.formState.errors.contactNo.message}</p>}
                    </div>
                </div>
                {/* Station Details - Geo Latitude, Geo Longitude, Operating Hours (NEW ORDER) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                    <div>
                        <Label htmlFor="geoLatitude" className={labelClass}>Geo Latitude</Label>
                        <Input id="geoLatitude" placeholder="e.g., 12.9716" className={inputBaseClass} {...form.register('geoLatitude')} />
                        {form.formState.errors.geoLatitude && <p className="text-xs text-red-500 mt-1">{form.formState.errors.geoLatitude.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="geoLongitude" className={labelClass}>Geo Longitude</Label>
                        <Input id="geoLongitude" placeholder="e.g., 77.5946" className={inputBaseClass} {...form.register('geoLongitude')} />
                        {form.formState.errors.geoLongitude && <p className="text-xs text-red-500 mt-1">{form.formState.errors.geoLongitude.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="operatingHours" className={labelClass}>Operating Hours</Label>
                        <Input id="operatingHours" placeholder="e.g., 9 AM - 6 PM" className={inputBaseClass} {...form.register('operatingHours')} />
                        {form.formState.errors.operatingHours && <p className="text-xs text-red-500 mt-1">{form.formState.errors.operatingHours.message}</p>}
                    </div>
                </div>
                {/* Station Details - Address & KYC Document (NEW ORDER - LAST) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="flex flex-col"> {/* Ensure label and textarea are in a column */}
                        <Label htmlFor="address" className={labelClass}>Address *</Label>
                        <Textarea 
                            id="address" 
                            placeholder="Full station address" 
                            className={`${inputBaseClass} min-h-[100px] flex-grow`} // flex-grow for textarea
                            {...form.register('address')} 
                        />
                        {form.formState.errors.address && <p className="text-xs text-red-500 mt-1">{form.formState.errors.address.message}</p>}
                    </div>
                    <div className="flex flex-col"> {/* Ensure label and file input are in a column */}
                        <Label htmlFor="kycFile-input" className={labelClass}>KYC Document</Label>
                        <label 
                            htmlFor="kycFile-input" 
                            className={`flex flex-col items-center justify-center w-full min-h-[100px] h-full px-4 transition bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-lg appearance-none cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 focus-within:border-purple-500`}
                        >
                            <UploadCloud className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-2" />
                            <span className="font-medium text-gray-600 dark:text-gray-400 text-sm text-center">
                                {selectedKycFileName || 'Click to upload or drag & drop'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                            <input 
                                id="kycFile-input" 
                                type="file" 
                                className="sr-only" 
                                accept=".pdf,.jpg,.jpeg,.png" 
                                {...form.register('kycFile')}
                                onChange={handleKycFileChange} 
                            />
                        </label>
                        {form.formState.errors.kycFile && <p className="text-xs text-red-500 mt-1">{form.formState.errors.kycFile.message}</p>}
                    </div>
                  </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-lg text-base text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-opacity focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-slate-900" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : mainButtonText}
            </Button>
          </form>

          <div className="flex items-center my-8">
            <hr className="flex-grow border-t border-gray-300 dark:border-slate-700" />
            <span className="mx-4 text-xs text-gray-500 dark:text-gray-400">Or continue with</span>
            <hr className="flex-grow border-t border-gray-300 dark:border-slate-700" />
          </div>
          
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              {formMode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                onClick={() => setFormMode(formMode === 'login' ? 'signup' : 'login')}
                className="ml-1 font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
              >
                {formMode === 'login' ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
       <footer className="pt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} HP. All rights reserved.
      </footer>
    </div>
  );
}
