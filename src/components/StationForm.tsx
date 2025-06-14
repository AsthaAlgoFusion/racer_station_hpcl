import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, UploadCloud, FileText } from 'lucide-react';
import { useState } from 'react';

const stationFormSchema = z.object({
  stationName: z.string().min(3, { message: 'Station Name must be at least 3 characters.' }),
  stationOwnerName: z.string().min(3, { message: 'Owner Name must be at least 3 characters.' }),
  proofType: z.string({ required_error: 'Please select a proof type.' }),
  idProofNo: z.string().min(3, { message: 'ID Proof No. must be at least 3 characters.' }),
  stationRegistrationNumber: z.string().min(3, { message: 'Registration No. must be at least 3 characters.' }),
  contactNo: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  geoLatitude: z.string().optional(),
  geoLongitude: z.string().optional(),
  operatingHours: z.string().optional(),
  kycFile: z.any().optional(), // Using any for FileList, actual validation might need more
});

type StationFormValues = z.infer<typeof stationFormSchema>;

interface StationFormProps {
  onStationInfoSubmit: () => void;
  username: string;
}

export default function StationForm({ onStationInfoSubmit, username }: StationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationFormSchema),
    defaultValues: {
      stationName: '',
      stationOwnerName: '',
      idProofNo: '',
      stationRegistrationNumber: '',
      contactNo: '',
      email: '',
      address: '',
      geoLatitude: '',
      geoLongitude: '',
      operatingHours: '',
    },
  });

  const onSubmit = async (data: StationFormValues) => {
    setIsLoading(true);
    console.log('Station Form Data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would send data.kycFile to your backend here.
    // For now, we're just logging it.
    if (data.kycFile && data.kycFile.length > 0) {
      console.log('KYC File:', data.kycFile[0]);
    }

    toast.success('Station information submitted successfully!');
    setIsLoading(false);
    onStationInfoSubmit();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      form.setValue('kycFile', event.target.files); // Set the FileList
    } else {
      setSelectedFileName(null);
      form.setValue('kycFile', null);
    }
  };
  
  const inputBaseClass = "h-10 text-sm dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-950 p-4 py-8">
      <Card className="w-full max-w-2xl shadow-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="text-center pt-8 pb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Station Information
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 pt-1">
            Welcome, {username}! Please provide your station details. Fields marked with * are mandatory.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="stationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Station Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter station name" {...field} className={inputBaseClass} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stationOwnerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Station Owner Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owner name" {...field} className={inputBaseClass} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proofType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Proof Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputBaseClass}>
                            <SelectValue placeholder="Select a proof type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="dark:bg-slate-800">
                          <SelectItem value="aadhar">Aadhar Card</SelectItem>
                          <SelectItem value="pan">PAN Card</SelectItem>
                          <SelectItem value="driving_license">Driving License</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="voter_id">Voter ID</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idProofNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>ID Proof No. *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ID proof number" {...field} className={inputBaseClass} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stationRegistrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Station Registration Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter station registration no." {...field} className={inputBaseClass} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Contact No. *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter contact number" {...field} className={inputBaseClass} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={labelClass}>E-Mail *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} className={inputBaseClass} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={labelClass}>Address *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter full station address"
                          className={`${inputBaseClass} min-h-[100px]`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="geoLatitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Geo Latitude</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 12.9716" {...field} className={inputBaseClass} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="geoLongitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Geo Longitude</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 77.5946" {...field} className={inputBaseClass} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operatingHours"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={labelClass}>Operating Hours</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 9 AM - 6 PM, Mon-Sat" {...field} className={inputBaseClass} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="md:col-span-2">
                  <FormLabel className={labelClass}>KYC Document</FormLabel>
                  <FormControl>
                     <label htmlFor="kycFile" className={`flex items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary dark:hover:border-primary focus:outline-none`}>
                        <span className="flex items-center space-x-2">
                          <UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            {selectedFileName ? selectedFileName : 'Click to upload or drag and drop'}
                          </span>
                        </span>
                        <input 
                            id="kycFile" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                    Upload your KYC document (PDF, JPG, PNG). Max 5MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-base" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Station Information'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <footer className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} MyApp Station Portal. All rights reserved.
      </footer>
    </div>
  );
}
