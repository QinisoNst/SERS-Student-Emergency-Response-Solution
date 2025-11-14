'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc } from 'firebase/firestore';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/PageHeader';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useEffect } from 'react';

const profileFormSchema = z.object({
  contactName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  contactPhoneNumber: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  emergencyContactName: z.string().min(2, { message: 'Contact name must be at least 2 characters.' }),
  emergencyContactPhoneNumber: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  medicalInformation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'profile', user.uid);
  }, [user, firestore]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      contactName: '',
      contactPhoneNumber: '',
      emergencyContactName: '',
      emergencyContactPhoneNumber: '',
      medicalInformation: '',
    },
    mode: 'onChange',
  });

  // TODO: Fetch existing profile data and set form defaultValues
  useEffect(() => {
    // This is where you would fetch user profile data from Firestore
    // For now, we use mock data.
    const mockData = {
      contactName: 'Jane Doe',
      contactPhoneNumber: '123-456-7890',
      emergencyContactName: 'John Doe',
      emergencyContactPhoneNumber: '098-765-4321',
      medicalInformation: 'None',
    };
    form.reset(mockData);
  }, [form]);


  function onSubmit(data: ProfileFormValues) {
    if (!userProfileRef) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }
    
    setDocumentNonBlocking(userProfileRef, {
      ...data,
      id: user!.uid,
    }, { merge: true });

    toast({
      title: 'Profile Updated',
      description: 'Your information has been saved successfully.',
    });
  }

  return (
    <>
      <PageHeader
        title="Your Profile"
        description="Keep your information up-to-date for faster emergency response."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/user-avatar/100/100"} alt="@student" />
                  <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">Personal Information</CardTitle>
                  <CardDescription>This information helps us identify you correctly.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>This person will be contacted in case of an emergency.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact's Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency contact's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact's Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency contact's phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="medicalInformation"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Medical Information (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Allergies, conditions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
