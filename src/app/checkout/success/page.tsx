'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('order') ?? 'unknown';
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Thank you for your order!</h1>
        <p className="text-muted-foreground mb-4">
          Your order #{orderId} has been successfully placed.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          We'll send you a confirmation email with your order details.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/profile/orders')}
          >
            View Order
          </Button>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  );
}