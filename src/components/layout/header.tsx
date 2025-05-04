'use client';

import Link from 'next/link';
import { ShoppingCart, Package, LogIn, LogOut, User as UserIcon } from 'lucide-react'; // Added LogIn, LogOut, UserIcon
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config'; // Import Firebase auth
import { onAuthStateChanged, signOut, User } from 'firebase/auth'; // Import auth state listener, signOut, User type
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


export default function Header() {
  const { cart } = useCart();
  const [itemCount, setItemCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();


  // Avoid hydration mismatch for cart count
  useEffect(() => {
    setItemCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, [cart]);

   // Listen for Authentication State Changes
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       setCurrentUser(user);
       setAuthLoading(false); // Auth state determined
     });
     // Cleanup subscription on unmount
     return () => unsubscribe();
   }, []);

   // Handle Logout
   const handleLogout = async () => {
        try {
           await signOut(auth);
           toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
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
                 <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-[10px]">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Auth Button/Dropdown */}
          {authLoading ? (
             // Optional: Show a loading indicator while checking auth
             <Button variant="ghost" size="icon" disabled>
                <UserIcon className="h-5 w-5 animate-pulse" />
             </Button>
          ) : currentUser ? (
             // User is logged in - Show Dropdown
              <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                       <Avatar className="h-8 w-8">
                          {/* --- Comment: Add user photoURL if available --- */}
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
                   {/* --- Comment: Add links to user profile or order history pages --- */}
                   {/* <DropdownMenuItem onClick={() => router.push('/profile')}>
                     <UserIcon className="mr-2 h-4 w-4" />
                     <span>Profile</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => router.push('/orders')}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                   <DropdownMenuSeparator /> */}
                   <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                     <LogOut className="mr-2 h-4 w-4" />
                     <span>Log out</span>
                   </DropdownMenuItem>
                 </DropdownMenuContent>
              </DropdownMenu>
          ) : (
            // User is not logged in - Show Login Button
            <Link href="/login" passHref>
              <Button variant="outline" size="sm">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
