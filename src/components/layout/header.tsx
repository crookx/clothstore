
'use client';

import Link from 'next/link';
import { ShoppingCart, Package, LogIn, LogOut, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react'; // Added Loader2
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getFirebaseServices } from '@/lib/firebase/config'; // Import the function to get services
import { onAuthStateChanged, signOut, User, Auth } from 'firebase/auth'; // Import auth state listener, signOut, User type, Auth type
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip


export default function Header() {
  const { cart } = useCart();
  const [itemCount, setItemCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // Start as true until auth state is known
  const [authInstance, setAuthInstance] = useState<Auth | null>(null); // State to hold the Auth instance
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean | null>(null); // Track Firebase readiness (null initially)
  const { toast } = useToast();
  const router = useRouter();


  // Avoid hydration mismatch for cart count
  useEffect(() => {
    setItemCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, [cart]);

   // Get Auth instance and listen for state changes
   useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    // Try to get Firebase services
    const services = getFirebaseServices();

    if (services) {
      setIsFirebaseReady(true);
      const { auth } = services;
      setAuthInstance(auth); // Store the auth instance

      // Only subscribe if auth instance is available
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setAuthLoading(false); // Auth state determined
      }, (error) => {
        // Handle errors during auth state listening (less common)
        console.error("Error listening to auth state:", error);
        setCurrentUser(null); // Assume logged out on error
        setAuthLoading(false);
        toast({ title: "Authentication Error", description: "Could not verify user session.", variant: "destructive" });
      });

    } else {
      // Firebase initialization failed or services unavailable
      setIsFirebaseReady(false);
      setAuthLoading(false); // No auth state to wait for
      console.error("Header: Firebase services unavailable.");
      // Toast or visual indicator handled by isFirebaseReady state
    }

     // Cleanup subscription on unmount
     return () => {
        if (unsubscribe) {
            unsubscribe();
        }
     };
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []); // Run only once on mount

   // Handle Logout
   const handleLogout = async () => {
        if (!authInstance) {
            toast({ title: 'Logout Failed', description: 'Authentication service not available.', variant: 'destructive' });
            return;
        }
        try {
           await signOut(authInstance);
           toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
           setCurrentUser(null); // Explicitly set user to null on successful logout
           router.push('/'); // Redirect to home after logout
        } catch (error) {
            console.error("Logout Error:", error);
            toast({ title: 'Logout Failed', description: 'Could not log out. Please try again.', variant: 'destructive' });
        }
    };

    // Get initials for Avatar fallback
    const getInitials = (email?: string | null) => {
        return email ? email.substring(0, 1).toUpperCase() : <UserIcon className="h-4 w-4" />;
    };

    // Determine Auth Status Display
    let authDisplay;
    if (isFirebaseReady === false) {
        // Firebase initialization failed
        authDisplay = (
             <TooltipProvider>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" disabled className="cursor-not-allowed opacity-50">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                        </Button>
                    </TooltipTrigger>
                     <TooltipContent>
                        <p className="text-xs text-destructive-foreground bg-destructive p-1 rounded">Config Error</p>
                    </TooltipContent>
                 </Tooltip>
             </TooltipProvider>
        );
    } else if (authLoading || isFirebaseReady === null) {
        // Loading auth state or Firebase readiness still unknown
        authDisplay = (
             <Button variant="ghost" size="icon" disabled>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
             </Button>
        );
    } else if (currentUser) {
         // User is logged in - Show Dropdown
         authDisplay = (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || currentUser.email || 'User'} />
                        <AvatarFallback>{getInitials(currentUser.email)}</AvatarFallback>
                      </Avatar>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.displayName || 'Astra User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Add links to profile/orders later */}
                  {/* <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem> */}
                  {/* <DropdownMenuItem onClick={() => router.push('/orders')} className="cursor-pointer">
                     <Package className="mr-2 h-4 w-4" />
                     <span>My Orders</span>
                   </DropdownMenuItem> */}
                   {/* Add Admin Link if applicable */}
                   {/* {isAdmin && ( */}
                   <DropdownMenuItem onClick={() => router.push('/admin/dashboard')} className="cursor-pointer">
                         <Package className="mr-2 h-4 w-4" /> {/* Re-use package icon */}
                         <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                   {/* )} */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
         );
    } else {
       // User is not logged in - Show Login Button
       authDisplay = (
           <Link href="/login" passHref>
             <Button variant="outline" size="sm">
               <LogIn className="mr-2 h-4 w-4" /> Login
             </Button>
           </Link>
       );
    }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary">AstraBaby</span>
        </Link>
        <nav className="flex items-center space-x-4">
          {/* Cart Button */}
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {itemCount > 0 && (
                 <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-[1rem] justify-center rounded-full p-0.5 text-[10px]">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Auth Button/Dropdown */}
          {authDisplay}

        </nav>
      </div>
    </header>
  );
}
