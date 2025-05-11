import { loadStripe } from '@stripe/stripe-js';
import { Order } from '@/types/order';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function createPaymentIntent(order: Omit<Order, 'id'>) {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(order.total * 100), // Convert to cents
      orderId: order.id,
    }),
  });

  return response.json();
}

export async function confirmPayment(clientSecret: string, paymentMethodId: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to initialize');

  return stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethodId,
  });
}