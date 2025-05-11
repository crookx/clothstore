'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useCheckout } from '@/context/checkout-context';
import { useAuth } from '@/context/auth-context';
import { createOrder } from '@/services/orderService';
import { createPaymentIntent, confirmPayment } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card } from '@/components/ui/card';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
  const { shippingAddress } = useCheckout();
  const router = useRouter();
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !user) return;

    setProcessing(true);

    try {
      // Create the order
      const orderId = await createOrder({
        userId: user.uid,
        items: cart,
        total,
        shippingAddress,
      });

      // Create payment intent
      const { clientSecret } = await createPaymentIntent({
        id: orderId,
        total,
        userId: user.uid,
        items: cart,
        shippingAddress,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      // Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?order=${orderId}`,
        },
      });

      if (confirmError) {
        toast({
          title: "Payment failed",
          description: confirmError.message,
          variant: "destructive",
        });
      } else {
        clearCart();
        router.push(`/checkout/success?order=${orderId}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button 
        className="mt-4 w-full"
        disabled={!stripe || processing}
      >
        {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  const [clientSecret] = useState(() => {
    // In production, fetch this from your API
    return process.env.NEXT_PUBLIC_STRIPE_TEST_CLIENT_SECRET;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Payment Information</h1>
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
              },
            }}
          >
            <CheckoutForm />
          </Elements>
        )}
      </Card>
    </div>
  );
}