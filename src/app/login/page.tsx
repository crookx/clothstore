// src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebaseServices, firebaseInitializationError } from '@/lib/firebase/config'; // Import getFirebaseServices and error state
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup, // Import for Google Sign-In
  // Import other providers like GithubAuthProvider if needed
   Auth, // Import Auth type
   getAuth, // Import getAuth if needed for re-check (though getFirebaseServices handles it)
   UserCredential // Import UserCredential type
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, UserPlus, Chrome, AlertCircle, Loader2 } from 'lucide-react'; // Added Loader2
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Import Alert
import { Separator } from '@/components/ui/separator'; // Import Separator

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Specific errors for this form
  const [authInstance, setAuthInstance] = useState<Auth | null>(null); // State for Auth instance
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean | null>(null); // Track Firebase readiness (null initially)
  const router = useRouter();
  const { toast } = useToast();

  // --- Get Auth instance ---
   useEffect(() => {
     // Use getFirebaseServices to check readiness and get services
     const services = getFirebaseServices();

     if (services) {
       setIsFirebaseReady(true);
       setAuthInstance(services.auth);
     } else {
       // Firebase initialization failed or services unavailable
       setIsFirebaseReady(false);
       // Error is already logged globally by config.ts
       // We just set the state here to disable the form
       console.error("Login Page: Firebase services unavailable.");
       // Optionally, show a toast specific to this page
        // toast({ title: 'Service Error', description: 'Authentication service failed to load.', variant: 'destructive' });
     }
   }, [toast]); // Added toast dependency


  // --- Helper Function for Redirection ---
  const handleRedirect = async (userCredential: UserCredential) => {
    const user = userCredential.user;
    if (!user) {
      console.error("Redirect failed: User object not available.");
      router.push('/'); // Fallback redirect
      return;
    }

    setIsLoading(true); // Show loading during claim check
    setError(null);

    try {
      // Get the ID token result which contains custom claims
      const idTokenResult = await user.getIdTokenResult();

      // --- Comment for User: Setting Admin Custom Claims ---
      // IMPORTANT: The 'admin' custom claim checked below needs to be set on the
      // user's Firebase Auth record. This is typically done on the backend,
      // often using Firebase Functions. You cannot set custom claims directly
      // from the client-side code for security reasons.
      //
      // Example using Firebase Admin SDK (in a Firebase Function):
      //
      // const admin = require('firebase-admin');
      // admin.initializeApp();
      //
      // exports.setAdminRole = functions.https.onCall(async (data, context) => {
      //   // Optional: Check if the caller is already an admin
      //   // if (!context.auth?.token?.admin) {
      //   //   throw new functions.https.HttpsError('permission-denied', 'Must be admin to set roles.');
      //   // }
      //   const userEmail = data.email;
      //   try {
      //     const user = await admin.auth().getUserByEmail(userEmail);
      //     await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      //     return { message: `Success! ${userEmail} is now an admin.` };
      //   } catch (error) {
      //     console.error("Error setting custom claim:", error);
      //     throw new functions.https.HttpsError('internal', 'Failed to set admin role.');
      //   }
      // });
      // --- End Comment ---

      // Check for the 'admin' custom claim
      if (idTokenResult.claims.admin === true) {
        console.log("Admin user detected. Redirecting to admin dashboard.");
        router.push('/admin/dashboard');
      } else {
        console.log("Standard user detected. Redirecting to home page.");
        router.push('/');
      }
    } catch (claimError) {
      console.error("Error getting user claims:", claimError);
      toast({ title: 'Redirection Error', description: 'Could not verify user role.', variant: 'destructive' });
      router.push('/'); // Fallback redirect on claim error
    } finally {
      // Short delay to allow redirect to initiate before hiding loader
      // May not be strictly necessary depending on browser behavior
      setTimeout(() => setIsLoading(false), 300);
    }
  };


  // --- Comment for User: Firebase Auth Setup ---
  // Make sure you have enabled Email/Password and Google Sign-in (and any other providers)
  // in your Firebase project's Authentication settings.

  const handleAuthAction = async (action: 'login' | 'signup') => {
    // Check readiness again before action
    if (!isFirebaseReady || !authInstance) {
       setError("Authentication service is not ready."); // Set local error
       toast({ title: 'Error', description: 'Authentication service not available.', variant: 'destructive' });
       return;
    }
    setIsLoading(true);
    setError(null); // Clear previous form-specific errors
    try {
      let userCredential;
      if (action === 'login') {
        userCredential = await signInWithEmailAndPassword(authInstance, email, password);
        toast({ title: 'Login Successful', description: 'Welcome back!' });
      } else {
        userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
        // --- Note: New users won't have custom claims set immediately.
        // They will be redirected to '/' unless you have backend logic
        // to set claims upon signup.
        toast({ title: 'Signup Successful', description: 'Welcome to AstraBaby!' });
      }
       console.log(`${action} successful for user:`, userCredential.user.uid);
       await handleRedirect(userCredential); // Handle redirection based on role

    } catch (err: any) {
      console.error(`Authentication Error (${action}):`, err.code, err.message);
      // Provide more user-friendly error messages
      let message = "An unexpected error occurred. Please try again.";
      switch (err.code) {
         case 'auth/user-not-found':
         case 'auth/invalid-credential': // Covers wrong password and other issues in newer SDKs
            message = 'Invalid email or password.';
            break;
         case 'auth/wrong-password': // Still handle older code just in case
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
         case 'auth/missing-password':
              message = 'Please enter a password.';
              break;
         case 'auth/operation-not-allowed':
              message = `${action === 'login' ? 'Email/Password sign-in' : 'Account creation'} is not enabled.`;
              break;
         case 'auth/too-many-requests':
              message = 'Access temporarily disabled due to too many requests. Please try again later.';
              break;
         // Add more specific Firebase Auth error codes as needed
      }
      setError(message); // Set local form error
      toast({ title: `${action === 'login' ? 'Login' : 'Signup'} Failed`, description: message, variant: 'destructive' });
       setIsLoading(false); // Stop loading on error
    }
    // finally { // Removed finally block - setIsLoading handled within try/catch and handleRedirect
    //   setIsLoading(false);
    // }
  };

   // --- Google Sign-In Handler ---
   const handleGoogleSignIn = async () => {
        // Check readiness again before action
        if (!isFirebaseReady || !authInstance) {
           setError("Authentication service is not ready.");
           toast({ title: 'Error', description: 'Authentication service not available.', variant: 'destructive' });
           return;
        }
       setIsLoading(true);
       setError(null); // Clear previous form-specific errors
       const provider = new GoogleAuthProvider();
       try {
           const result = await signInWithPopup(authInstance, provider);
            console.log('Google Sign-In successful for user:', result.user.uid);
           toast({ title: 'Login Successful', description: 'Welcome!' });
           await handleRedirect(result); // Handle redirection based on role

       } catch (err: any) {
           console.error("Google Sign-In Error:", err.code, err.message);
           let message = "Could not sign in with Google. Please try again.";
            // Handle specific Google sign-in errors if necessary
           if (err.code === 'auth/popup-closed-by-user') {
                message = 'Google Sign-In cancelled.';
           } else if (err.code === 'auth/account-exists-with-different-credential') {
               message = 'An account already exists with this email using a different sign-in method.';
           } else if (err.code === 'auth/popup-blocked') {
                message = 'Sign-in popup blocked by browser. Please allow popups for this site.';
           } else if (err.code === 'auth/operation-not-allowed') {
                message = 'Google Sign-In is not enabled for this project.';
           } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-already-opened'){
                message = 'Only one sign-in attempt allowed at a time.';
           }
           setError(message); // Set local form error
           toast({ title: 'Google Sign-In Failed', description: message, variant: 'destructive' });
            setIsLoading(false); // Stop loading on error
       }
      //  finally { // Removed finally block
      //      setIsLoading(false);
      //  }
   };


  // --- Determine Overall Page State ---
   const isFormDisabled = isLoading || isFirebaseReady === false;
   const showFirebaseError = isFirebaseReady === false;

   // Show loading indicator while checking Firebase readiness
   if (isFirebaseReady === null) {
       return (
           <div className="container mx-auto flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center px-4 py-12">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading login...</p>
                </div>
           </div>
       );
   }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center px-4 py-12">
        <Tabs defaultValue="login" className="w-full max-w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" disabled={showFirebaseError}>
                {showFirebaseError && <AlertCircle className="mr-2 h-4 w-4 text-destructive"/>}
                <LogIn className="mr-2 h-4 w-4" /> Login
            </TabsTrigger>
            <TabsTrigger value="signup" disabled={showFirebaseError}>
                 {showFirebaseError && <AlertCircle className="mr-2 h-4 w-4 text-destructive"/>}
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </TabsTrigger>
          </TabsList>

           {/* Display overall error if Firebase isn't ready */}
           {showFirebaseError && (
               <Card className="mt-4 border-destructive bg-destructive/10">
                   <CardHeader>
                       <CardTitle className="text-destructive flex items-center">
                           <AlertCircle className="mr-2 h-5 w-5"/> Configuration Error
                       </CardTitle>
                   </CardHeader>
                    <CardContent>
                       <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Service Unavailable</AlertTitle>
                          <AlertDescription>
                            Authentication is currently unavailable due to a configuration issue. Please ensure your Firebase environment variables are set correctly in <code>.env.local</code> and the server has been restarted. Check the browser console for more specific details.
                          </AlertDescription>
                      </Alert>
                   </CardContent>
               </Card>
           )}


          {/* Login Tab */}
          <TabsContent value="login">
             <Card className={showFirebaseError ? 'opacity-50 pointer-events-none' : ''}>
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
                     disabled={isFormDisabled}
                     aria-invalid={!!error} // Indicate error state for accessibility
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
                     disabled={isFormDisabled}
                     aria-invalid={!!error} // Indicate error state for accessibility
                   />
                 </div>
                 {error && <p className="text-sm text-destructive">{error}</p>}
               </CardContent>
               <CardFooter className="flex flex-col gap-4">
                  <Button onClick={() => handleAuthAction('login')} className="w-full" disabled={isFormDisabled}>
                     {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Logging In...</> : 'Login'}
                  </Button>
                 <Separator className="my-2" />
                 <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={isFormDisabled}>
                     {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : <><Chrome className="mr-2 h-4 w-4" /> Sign in with Google</>}
                  </Button>
                  {/* Add other OAuth providers here */}
               </CardFooter>
             </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
               <Card className={showFirebaseError ? 'opacity-50 pointer-events-none' : ''}>
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
                       disabled={isFormDisabled}
                       aria-invalid={!!error} // Indicate error state for accessibility
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
                       disabled={isFormDisabled}
                       aria-invalid={!!error} // Indicate error state for accessibility
                     />
                   </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                 </CardContent>
                 <CardFooter className="flex flex-col gap-4">
                     <Button onClick={() => handleAuthAction('signup')} className="w-full" disabled={isFormDisabled}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating Account...</> : 'Sign Up'}
                     </Button>
                    <Separator className="my-2" />
                    <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={isFormDisabled}>
                       {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : <><Chrome className="mr-2 h-4 w-4" /> Sign up with Google</>}
                     </Button>
                      {/* Add other OAuth providers here */}
                 </CardFooter>
               </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
