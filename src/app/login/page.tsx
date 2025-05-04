// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup, // Import for Google Sign-In
  // Import other providers like GithubAuthProvider if needed
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, UserPlus, Chrome } from 'lucide-react'; // Added Chrome for Google Icon

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // --- Comment for User: Firebase Auth Setup ---
  // Make sure you have enabled Email/Password and Google Sign-in (and any other providers)
  // in your Firebase project's Authentication settings.

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setIsLoading(true);
    setError(null);
    try {
      if (action === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Login Successful', description: 'Welcome back!' });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: 'Signup Successful', description: 'Welcome to AstraBaby!' });
      }
      router.push('/'); // Redirect to home or dashboard after auth
    } catch (err: any) {
      console.error("Authentication Error:", err);
      // Provide more user-friendly error messages
      let message = "An unexpected error occurred. Please try again.";
      switch (err.code) {
         case 'auth/user-not-found':
         case 'auth/wrong-password':
           message = 'Invalid email or password.';
           break;
         case 'auth/email-already-in-use':
           message = 'This email address is already registered.';
           break;
         case 'auth/weak-password':
           message = 'Password should be at least 6 characters long.';
           break;
         case 'auth/invalid-email':
              message = 'Please enter a valid email address.';
              break;
          // Add more specific Firebase Auth error codes as needed
      }
      setError(message);
      toast({ title: 'Authentication Failed', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

   // --- Google Sign-In Handler ---
   const handleGoogleSignIn = async () => {
       setIsLoading(true);
       setError(null);
       const provider = new GoogleAuthProvider();
       try {
           await signInWithPopup(auth, provider);
           toast({ title: 'Login Successful', description: 'Welcome!' });
           router.push('/'); // Redirect after successful Google sign-in
       } catch (err: any) {
           console.error("Google Sign-In Error:", err);
           let message = "Could not sign in with Google. Please try again.";
            // Handle specific Google sign-in errors if necessary
           if (err.code === 'auth/popup-closed-by-user') {
                message = 'Google Sign-In cancelled.';
           }
           setError(message);
           toast({ title: 'Google Sign-In Failed', description: message, variant: 'destructive' });
       } finally {
           setIsLoading(false);
       }
   };


  return (
    <div className="container mx-auto flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center px-4 py-12">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login"><LogIn className="mr-2 h-4 w-4" /> Login</TabsTrigger>
            <TabsTrigger value="signup"><UserPlus className="mr-2 h-4 w-4" /> Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
             <Card>
               <CardHeader>
                 <CardTitle>Login to AstraBaby</CardTitle>
                 <CardDescription>Access your account and order history.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="login-email">Email</Label>
                   <Input
                     id="login-email"
                     type="email"
                     placeholder="you@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     disabled={isLoading}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="login-password">Password</Label>
                   <Input
                     id="login-password"
                     type="password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     disabled={isLoading}
                   />
                 </div>
                 {error && <p className="text-sm text-destructive">{error}</p>}
               </CardContent>
               <CardFooter className="flex flex-col gap-4">
                  <Button onClick={() => handleAuthAction('login')} className="w-full" disabled={isLoading}>
                     {isLoading ? 'Logging In...' : 'Login'}
                  </Button>
                 <Separator className="my-2" />
                 <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
                    <Chrome className="mr-2 h-4 w-4" /> {isLoading ? 'Processing...' : 'Sign in with Google'}
                  </Button>
                  {/* Add other OAuth providers here */}
               </CardFooter>
             </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
               <Card>
                 <CardHeader>
                   <CardTitle>Create Account</CardTitle>
                   <CardDescription>Join AstraBaby to start shopping.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="signup-email">Email</Label>
                     <Input
                       id="signup-email"
                       type="email"
                       placeholder="you@example.com"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       disabled={isLoading}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="signup-password">Password</Label>
                     <Input
                       id="signup-password"
                       type="password"
                       placeholder="Choose a secure password (min. 6 chars)"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                       disabled={isLoading}
                     />
                   </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                 </CardContent>
                 <CardFooter className="flex flex-col gap-4">
                     <Button onClick={() => handleAuthAction('signup')} className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                     </Button>
                    <Separator className="my-2" />
                    <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
                       <Chrome className="mr-2 h-4 w-4" /> {isLoading ? 'Processing...' : 'Sign up with Google'}
                     </Button>
                      {/* Add other OAuth providers here */}
                 </CardFooter>
               </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
