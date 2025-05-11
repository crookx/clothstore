'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { toast } = useToast();

  const subtotal = cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const total = subtotal; // Add tax, shipping calculations later if needed

  const handleCheckout = () => {
    if (!user) {
      // If user is not logged in, redirect to login with return URL
      toast({
        title: "Login Required",
        description: "Please login to continue with checkout",
        variant: "destructive",
      });
      router.push(`/login?redirect=${encodeURIComponent('/checkout')}`);
      return;
    }

    // Check if cart is not empty
    if (!cart?.length) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checkout.",
        variant: "destructive",
      });
      return;
    }

    // Proceed to checkout
    router.push('/checkout/shipping');
  };

  if (!cart?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-muted-foreground">Your cart is empty</p>
        <Button 
          className="mt-4"
          onClick={() => router.push('/products')}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-4">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={() => removeFromCart(item.id)}
            onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
          />
        ))}
      </div>
      <div className="mt-8">
        <div className="text-lg font-semibold">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p className="text-xl mt-2">Total: ${total.toFixed(2)}</p>
        </div>
        <Button 
          className="mt-4 w-full"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
