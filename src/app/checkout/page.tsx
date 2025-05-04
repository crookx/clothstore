'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { CreditCard, Truck, LogIn, User as UserIcon } from 'lucide-react'; // Added LogIn, UserIcon
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { placeOrder } from '@/services/orderService'; // Import the order service
import { auth } from '@/lib/firebase/config'; // Import Firebase auth
import { onAuthStateChanged, User } from 'firebase/auth'; // Import auth state listener and User type

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // State for authenticated user
  const [authLoading, setAuthLoading] = useState(true); // State for auth loading

  // --- Listen for Authentication State Changes ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false); // Auth state determined
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 5.00; // Example shipping cost
  const taxRate = 0.08; // Example tax rate (8%)
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;


  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // --- Comment for User: Authentication Check ---
    // You might want to enforce login before checkout, or allow guest checkout.
    // Currently, it allows guest checkout but associates the order with the user if logged in.
    // if (!currentUser) {
    //   toast({ title: "Please Log In", description: "You need to be logged in to place an order.", variant: "destructive" });
    //   setIsLoading(false);
    //   // Optionally redirect to login page: router.push('/login');
    //   return;
    // }

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

    // --- Comment for User: Payment Gateway Integration ---
    // This is where you would integrate your payment gateway (e.g., Stripe).
    // 1. Create a payment intent on your server.
    // 2. Collect payment details using Stripe Elements or similar.
    // 3. Confirm the payment intent on the client.
    // 4. If payment is successful, then proceed to place the order in Firestore.
    //
    // const paymentIntentId = await processPayment(formData.get('cardNumber'), ...); // Placeholder
    // if (!paymentIntentId) {
    //   toast({ title: "Payment Failed", description: "Could not process payment.", variant: "destructive" });
    //   setIsLoading(false);
    //   return;
    // }
    // --- End Payment Gateway Placeholder ---


    try {
       // Pass the current user to the placeOrder function
      const orderId = await placeOrder(
        shippingInfo,
        cart,
        subtotal,
        shippingCost,
        tax,
        total,
        // paymentIntentId, // Pass payment ID if using a gateway
        currentUser // Pass the user object
      );

      console.log('Order placed successfully with ID:', orderId); // Log for debugging

      // Clear the cart *after* successful order placement
      clearCart();

      // Show success toast
      toast({
        title: "Order Placed Successfully!",
        description: `Thank you! Your order #${orderId.substring(0, 6)} is being processed.`, // Show partial ID
        variant: 'default',
      });

      // Redirect to a confirmation page or home
      router.push('/'); // Redirect to home for now (consider an order confirmation page)

    } catch (error) {
      console.error("Order placement failed:", error);
      toast({
        title: "Order Failed",
        // Display specific error messages if available (e.g., stock issues)
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

   if (cart.length === 0) {
        // Don't render the form if cart is empty or redirecting
       return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Your cart is empty. Redirecting...</p>
            </div>
       );
   }


  // Show loading indicator while checking auth state
  if (authLoading) {
     return (
        <div className="container mx-auto px-4 py-8 text-center">
           <p className="text-muted-foreground">Loading user information...</p>
           {/* Optional: Add a spinner here */}
        </div>
     );
   }


  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold text-primary">Checkout</h1>
            {/* --- User Auth Display/Link --- */}
           <div>
             {currentUser ? (
                 <span className="text-sm text-muted-foreground flex items-center">
                   <UserIcon className="mr-2 h-4 w-4"/> Logged in as {currentUser.email || currentUser.displayName || 'User'}
                 </span>
              ) : (
                <Link href="/login" passHref> {/* --- Comment: Create /login page --- */}
                   <Button variant="outline">
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
                  <Input id="firstName" name="firstName" required placeholder="Astra" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required placeholder="Baby" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required placeholder="123 Starship Lane" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required placeholder="Galaxy City" />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" name="state" required placeholder="Cosmos" />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP/Postal Code</Label>
                  <Input id="zip" name="zip" required placeholder="98765" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                 {/* Pre-fill email if user is logged in, make it read-only? */}
                 <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    defaultValue={currentUser?.email || ''}
                    // readOnly={!!currentUser?.email} // Optional: Prevent editing if logged in
                 />
               </div>
            </CardContent>
          </Card>

           {/* --- Payment Section (Commented Out/Placeholder) --- */}
           <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 opacity-50 cursor-not-allowed">
             <CardHeader>
               <CardTitle className="flex items-center text-primary"><CreditCard className="mr-2 h-5 w-5" /> Payment Details</CardTitle>
               <CardDescription>Payment gateway integration is pending.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                 {/* --- Comment for User: Payment Gateway Elements ---
                 This section should be replaced by your payment gateway's
                 UI elements (e.g., Stripe Card Element). For now, it's disabled.
                 Remove the 'opacity-50 cursor-not-allowed' from the Card above when implemented.
                 --- */}
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
           {/* --- End Payment Section Placeholder --- */}
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
                              // Enhanced AI Hint: Added 'checkout summary' context
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
                {/* --- Comment for User: Disable button until payment implemented --- */}
              <Button
                 type="submit"
                 size="lg"
                 className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                 disabled={isLoading /* || !isPaymentReady */} // Add payment readiness check
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
