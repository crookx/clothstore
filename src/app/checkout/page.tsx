
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { CreditCard, Truck, LogIn, User as UserIcon, AlertCircle } from 'lucide-react'; // Added LogIn, UserIcon, AlertCircle
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { placeOrder } from '@/services/orderService'; // Import the order service
import { ensureFirebaseServices, firebaseInitializationError } from '@/lib/firebase/config'; // Import ensureFirebaseServices and error state
import { onAuthStateChanged, User, Auth } from 'firebase/auth'; // Import auth state listener and User type, Auth type
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Import Alert

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // State for authenticated user
  const [authLoading, setAuthLoading] = useState(true); // State for auth loading
  const [authInstance, setAuthInstance] = useState<Auth | null>(null); // State to hold Auth instance
  const [isFirebaseReady, setIsFirebaseReady] = useState(false); // Track Firebase readiness


  // --- Listen for Authentication State Changes ---
  useEffect(() => {
     let unsubscribe: (() => void) | null = null;
     // Use ensureFirebaseServices to get services or null if failed
     const services = ensureFirebaseServices();

     if (services) {
        setIsFirebaseReady(true);
        const { auth } = services;
        setAuthInstance(auth); // Store auth instance

         unsubscribe = onAuthStateChanged(auth, (user) => {
           setCurrentUser(user);
           setAuthLoading(false); // Auth state determined
         });
     } else {
         // Firebase initialization failed
         setIsFirebaseReady(false);
         setAuthLoading(false); // No point waiting for auth state
         console.error("Checkout: Firebase services unavailable.");
          toast({ title: "Configuration Error", description: "Could not load user information or process order.", variant: "destructive" });
     }

     // Cleanup subscription on unmount
     return () => {
       if (unsubscribe) {
         unsubscribe();
       }
     };
   }, [toast]);


  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 5.00; // Example shipping cost
  const taxRate = 0.08; // Example tax rate (8%)
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;


  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

     if (!isFirebaseReady) {
        toast({ title: "Cannot Place Order", description: "Service unavailable due to configuration error.", variant: "destructive" });
        return;
     }

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const shippingInfo = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip: formData.get('zip') as string,
      email: formData.get('email') as string,
    };


    try {
      const orderId = await placeOrder(
        shippingInfo,
        cart,
        subtotal,
        shippingCost,
        tax,
        total,
        currentUser
      );

      console.log('Order placed successfully with ID:', orderId); // Log for debugging
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Thank you! Your order #${orderId.substring(0, 6)} is being processed.`, // Show partial ID
        variant: 'default',
      });
      router.push(`/order-confirmation?id=${orderId}`);

    } catch (error) {
      console.error("Order placement failed:", error);
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if cart is empty (client-side check)
   useEffect(() => {
      if (!isLoading && cart.length === 0 && typeof window !== 'undefined') {
        router.push('/');
      }
    }, [cart, isLoading, router]);

   // Show loading indicator while checking auth state OR if firebase isn't ready
   if (authLoading) {
     return (
        <div className="container mx-auto px-4 py-8 text-center">
           <p className="text-muted-foreground">Loading checkout...</p>
           {/* Optional: Add a spinner here */}
        </div>
     );
   }


   // Display error if Firebase is not ready
   if (!isFirebaseReady) {
       return (
           <div className="container mx-auto px-4 py-8">
               <h1 className="text-3xl font-bold text-primary mb-6">Checkout</h1>
               <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>Configuration Error</AlertTitle>
                   <AlertDescription>
                       Checkout is currently unavailable because the connection to our services failed.
                       Please ensure your <code>.env.local</code> configuration is correct and try again later.
                   </AlertDescription>
               </Alert>
                <Button onClick={() => router.push('/')} className="mt-4">Return to Shop</Button>
           </div>
       );
   }

    // If cart becomes empty after initial load (e.g., user clears it in another tab)
   if (cart.length === 0) {
       return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Your cart is empty. Redirecting...</p>
            </div>
       );
   }


  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold text-primary">Checkout</h1>
           <div>
             {currentUser ? (
                 <span className="text-sm text-muted-foreground flex items-center">
                   <UserIcon className="mr-2 h-4 w-4"/> Logged in as {currentUser.email || currentUser.displayName || 'User'}
                 </span>
              ) : (
                <Link href="/login" passHref>
                   <Button variant="outline" disabled={!isFirebaseReady}> {/* Disable if Firebase not ready */}
                       <LogIn className="mr-2 h-4 w-4" /> Log In / Sign Up
                   </Button>
                 </Link>
              )}
            </div>
        </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-primary"><Truck className="mr-2 h-5 w-5" /> Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required placeholder="Astra" disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required placeholder="Baby" disabled={isLoading}/>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required placeholder="123 Starship Lane" disabled={isLoading}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required placeholder="Galaxy City" disabled={isLoading}/>
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" name="state" required placeholder="Cosmos" disabled={isLoading}/>
                </div>
                <div>
                  <Label htmlFor="zip">ZIP/Postal Code</Label>
                  <Input id="zip" name="zip" required placeholder="98765" disabled={isLoading}/>
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                 <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    defaultValue={currentUser?.email || ''}
                    disabled={isLoading}
                 />
               </div>
            </CardContent>
          </Card>

           <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 opacity-50 cursor-not-allowed">
             <CardHeader>
               <CardTitle className="flex items-center text-primary"><CreditCard className="mr-2 h-5 w-5" /> Payment Details</CardTitle>
               <CardDescription>Payment gateway integration is pending.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <Label htmlFor="cardNumber">Card Number</Label>
                 <Input id="cardNumber" name="cardNumber" placeholder="**** **** **** 1234" disabled />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div>
                   <Label htmlFor="expiryDate">Expiry Date</Label>
                   <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" disabled />
                 </div>
                 <div>
                   <Label htmlFor="cvc">CVC</Label>
                   <Input id="cvc" name="cvc" placeholder="123" disabled />
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                   <div className="flex items-center space-x-2">
                       <div className="w-10 h-10 relative flex-shrink-0 overflow-hidden rounded">
                           <Image
                             src={item.imageUrl}
                             alt={item.name}
                             layout="fill"
                             objectFit="cover"
                             className="rounded"
                             data-ai-hint={`${item.category.toLowerCase()} checkout summary`}
                           />
                         </div>
                       <span className="truncate w-32">{item.name}</span>
                       <span>x{item.quantity}</span>
                   </div>
                   <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
               <div className="flex justify-between text-muted-foreground">
                 <span>Shipping</span>
                 <span>${shippingCost.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-muted-foreground">
                 <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                 <span>${tax.toFixed(2)}</span>
               </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg text-primary">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                 type="submit"
                 size="lg"
                 className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                 disabled={isLoading || !isFirebaseReady /* || !isPaymentReady */} // Disable if loading or Firebase error
                 >
                 {isLoading ? 'Processing...' : 'Place Order (Payment Pending)'}
               </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
