
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { CreditCard, Truck, LogIn, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react'; // Added Loader2
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { placeOrder } from '@/services/orderService'; // Import the order service
import { getFirebaseServices, firebaseInitializationError } from '@/lib/firebase/config'; // Import getFirebaseServices and error state
import { onAuthStateChanged, User, Auth } from 'firebase/auth'; // Import auth state listener and User type, Auth type
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Import Alert

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state for placing order
  const [currentUser, setCurrentUser] = useState<User | null>(null); // State for authenticated user
  const [authLoading, setAuthLoading] = useState(true); // State for checking auth status
  const [authInstance, setAuthInstance] = useState<Auth | null>(null); // State to hold Auth instance
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean | null>(null); // Track Firebase readiness (null initially)


  // --- Listen for Authentication State Changes ---
  useEffect(() => {
     let unsubscribe: (() => void) | null = null;
     const services = getFirebaseServices(); // Check Firebase readiness

     if (services) {
        setIsFirebaseReady(true);
        const { auth } = services;
        setAuthInstance(auth); // Store auth instance

         unsubscribe = onAuthStateChanged(auth, (user) => {
           setCurrentUser(user);
           setAuthLoading(false); // Auth state determined
         }, (error) => {
           console.error("Error listening to auth state:", error);
           setCurrentUser(null); // Assume logged out
           setAuthLoading(false);
           toast({ title: "Session Error", description: "Could not verify user session.", variant: "destructive" });
         });
     } else {
         // Firebase initialization failed
         setIsFirebaseReady(false);
         setAuthLoading(false); // No auth state to wait for
         console.error("Checkout: Firebase services unavailable.");
         // Error message displayed based on isFirebaseReady state
     }

     // Cleanup subscription on unmount
     return () => {
       if (unsubscribe) {
         unsubscribe();
       }
     };
   }, [toast]);


  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Example costs - replace with actual logic if needed
  const shippingCost = subtotal > 5000 ? 0 : 300; // Free shipping over 5000 KES
  const taxRate = 0.16; // Example VAT rate (16%)
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;


  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

     // Double-check Firebase readiness before placing order
     if (!isFirebaseReady || !getFirebaseServices()) {
        toast({ title: "Cannot Place Order", description: "Service unavailable. Please try again later.", variant: "destructive" });
        return;
     }

    setIsLoading(true); // Start loading indicator for order placement

    const formData = new FormData(event.currentTarget);
    const shippingInfo = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string, // Consider renaming 'state' if not applicable
      zip: formData.get('zip') as string,
      email: formData.get('email') as string, // Get email from form
    };

     // Validate form data (basic check)
     if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip || !shippingInfo.email) {
       toast({ title: "Missing Information", description: "Please fill in all required shipping details.", variant: "destructive" });
       setIsLoading(false);
       return;
     }


    try {
      // Pass the potentially updated currentUser state
      const orderId = await placeOrder(
        shippingInfo,
        cart,
        subtotal,
        shippingCost,
        tax,
        total,
        currentUser // Pass the current user state
      );

      console.log('Order placed successfully with ID:', orderId); // Log for debugging
      clearCart(); // Clear cart after successful order
      toast({
        title: "Order Placed Successfully!",
        description: `Thank you! Your order #${orderId.substring(0, 6)}... is being processed.`, // Show partial ID
        variant: 'default', // Use 'default' or 'success' style
        duration: 5000,
      });
      // Redirect to a dedicated order confirmation page
      router.push(`/order-confirmation?id=${orderId}`);

    } catch (error) {
      console.error("Order placement failed:", error);
      toast({
        title: "Order Failed",
        // Provide a more specific message if the error includes one
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please check your details or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  // Redirect if cart is empty (client-side check) - run after auth check completes
   useEffect(() => {
      if (!authLoading && cart.length === 0 && typeof window !== 'undefined') {
        toast({ description: "Your cart is empty. Redirecting...", duration: 3000 });
        router.push('/');
      }
    }, [cart, authLoading, router, toast]);

   // Show loading indicator while checking auth state OR if Firebase isn't ready yet
   if (authLoading || isFirebaseReady === null) {
     return (
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-theme(spacing.28))]">
             <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Loading checkout...</p>
            </div>
        </div>
     );
   }


   // Display error if Firebase initialization failed
   if (!isFirebaseReady) {
       return (
           <div className="container mx-auto px-4 py-8">
               <h1 className="text-3xl font-bold text-primary mb-6">Checkout</h1>
               <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>Configuration Error</AlertTitle>
                   <AlertDescription>
                      Checkout is currently unavailable because the connection to our services failed. Please try again later. If the problem persists, ensure your environment configuration is correct.
                   </AlertDescription>
               </Alert>
                <Button onClick={() => router.push('/')} className="mt-4" variant="outline">Return to Shop</Button>
           </div>
       );
   }

    // If cart becomes empty after initial load (e.g., user clears it in another tab)
   if (cart.length === 0) {
       return (
            <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-theme(spacing.28))]">
                 <div className="text-center space-y-3">
                    <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">Your cart is empty.</p>
                    <Button onClick={() => router.push('/')} variant="default">Start Shopping</Button>
                 </div>
            </div>
       );
   }


  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
           <h1 className="text-3xl font-bold text-primary">Checkout</h1>
           <div>
             {currentUser ? (
                 <span className="text-sm text-muted-foreground flex items-center">
                   <UserIcon className="mr-2 h-4 w-4 text-green-600"/> Logged in as {currentUser.email || currentUser.displayName || 'User'}
                 </span>
              ) : (
                 <Alert variant="default" className="border-accent bg-accent/10">
                    <LogIn className="h-4 w-4 text-accent" />
                    <AlertTitle>Optional Login</AlertTitle>
                    <AlertDescription>
                       <Link href="/login" className="font-medium text-accent hover:underline">Log in</Link> or create an account for faster checkout next time.
                    </AlertDescription>
                 </Alert>
              )}
            </div>
        </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border">
            <CardHeader>
              <CardTitle className="flex items-center text-primary"><Truck className="mr-2 h-5 w-5" /> Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Email Field - Pre-fill if logged in */}
               <div>
                 <Label htmlFor="email">Email Address</Label>
                  <Input
                     id="email"
                     name="email"
                     type="email"
                     required
                     placeholder="you@example.com"
                     // Pre-fill email if user is logged in, otherwise allow input
                     defaultValue={currentUser?.email || ''}
                     disabled={isLoading || !!currentUser?.email} // Disable if logged in with email
                     readOnly={!!currentUser?.email} // Make read-only if pre-filled
                  />
                  {currentUser?.email && <p className="text-xs text-muted-foreground mt-1">Using email from your logged-in account.</p>}
                </div>
                <Separator />
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
                <Input id="address" name="address" required placeholder="123 Starship Lane, Apt 4B" disabled={isLoading}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required placeholder="Nairobi" disabled={isLoading}/>
                </div>
                <div>
                   {/* Changed State/Province to County */}
                  <Label htmlFor="state">County</Label>
                  <Input id="state" name="state" required placeholder="Nairobi County" disabled={isLoading}/>
                </div>
                <div>
                  <Label htmlFor="zip">ZIP/Postal Code</Label>
                  <Input id="zip" name="zip" required placeholder="00100" disabled={isLoading}/>
                </div>
              </div>

            </CardContent>
          </Card>

           {/* Payment Section - Placeholder */}
           <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 opacity-60 border-dashed border-primary/30">
             <CardHeader>
               <CardTitle className="flex items-center text-primary"><CreditCard className="mr-2 h-5 w-5" /> Payment Details</CardTitle>
               <CardDescription>Payment gateway integration is needed here.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4 cursor-not-allowed">
                <div className="bg-muted p-4 rounded-md text-center text-muted-foreground">
                   <p>Secure payment processing coming soon!</p>
                   <p className="text-xs mt-1">(For now, clicking "Place Order" will complete the order without payment.)</p>
                 </div>
               {/* <div>
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
               </div> */}
             </CardContent>
           </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="max-h-60 overflow-y-auto space-y-3 pr-2"> {/* Scrollable items */}
                 {cart.map((item) => (
                   <div key={item.id} className="flex items-center justify-between text-sm space-x-2">
                      <div className="flex items-center space-x-2 min-w-0"> {/* Allow shrinking */}
                          <div className="w-10 h-10 relative flex-shrink-0 overflow-hidden rounded border">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="40px"
                                style={{ objectFit: 'cover' }}
                                className="rounded"
                                data-ai-hint={`${item.category.toLowerCase()} checkout summary`}
                                onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/placeholder/40/40'; }}
                              />
                            </div>
                           <div className="flex-grow min-w-0"> {/* Allow shrinking */}
                              <p className="truncate font-medium text-primary" title={item.name}>{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                       </div>
                      <span className="text-right font-medium whitespace-nowrap">KES {(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                 ))}
               </div>
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>KES {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `KES ${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                    <span>KES {tax.toFixed(2)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg text-primary">
                <span>Total</span>
                <span>KES {total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                 type="submit"
                 size="lg"
                 className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                 // Disable button if order placement is loading OR if Firebase isn't ready
                 disabled={isLoading || !isFirebaseReady /* Add || !isPaymentReady if using real payment */}
                 >
                 {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : 'Place Order'}
                 {/* Modify text if payment is pending: 'Place Order (Payment Pending)' */}
               </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
