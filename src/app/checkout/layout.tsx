'use client';

import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { redirect } from 'next/navigation';
import { Steps } from '@/components/checkout/Steps';
import { CheckoutProvider } from '@/context/checkout-context';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { cart } = useCart();

  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  if (cart.length === 0) {
    redirect('/cart');
  }

  return (
    <CheckoutProvider>
      <div className="container mx-auto px-4 py-8">
        <Steps />
        <main className="mt-8">{children}</main>
      </div>
    </CheckoutProvider>
  );
}