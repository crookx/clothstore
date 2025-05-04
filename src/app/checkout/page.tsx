'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { CreditCard, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 5.00; // Example shipping cost
  const taxRate = 0.08; // Example tax rate (8%)
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate order placement (replace with actual API call/Firebase logic)
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Order placed for:', cart); // Log for debugging

    // Clear the cart
    clearCart();

    setIsLoading(false);

    // Show success toast
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. Your order is being processed.",
      variant: 'default', // Use default or create a success variant
    });

    // Redirect to a confirmation page or home
    router.push('/'); // Redirect to home for now
  };

  if (cart.length === 0 && typeof window !== 'undefined') {
    // Redirect if cart is empty (client-side check after mount)
     router.push('/');
     return null; // Render nothing while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Checkout</h1>

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
                  <Input id="firstName" required placeholder="Astra" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required placeholder="Baby" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" required placeholder="123 Starship Lane" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required placeholder="Galaxy City" />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" required placeholder="Cosmos" />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP/Postal Code</Label>
                  <Input id="zip" required placeholder="98765" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                 <Input id="email" type="email" required placeholder="you@example.com" />
               </div>
            </CardContent>
          </Card>

           <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
             <CardHeader>
               <CardTitle className="flex items-center text-primary"><CreditCard className="mr-2 h-5 w-5" /> Payment Details</CardTitle>
               <CardDescription>Enter your payment information below.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <Label htmlFor="cardNumber">Card Number</Label>
                 <Input id="cardNumber" required placeholder="**** **** **** 1234" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div>
                   <Label htmlFor="expiryDate">Expiry Date</Label>
                   <Input id="expiryDate" required placeholder="MM/YY" />
                 </div>
                 <div>
                   <Label htmlFor="cvc">CVC</Label>
                   <Input id="cvc" required placeholder="123" />
                 </div>
               </div>
              {/* Add more payment fields or gateway integration here */}
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
                             data-ai-hint={`${item.category} product checkout summary`}
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
              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                 {isLoading ? 'Processing...' : 'Place Order'}
               </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
