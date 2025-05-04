'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Add tax, shipping calculations later if needed
  const total = subtotal;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary flex items-center">
        <ShoppingCart className="mr-3 h-8 w-8" /> Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <Card className="text-center py-12 shadow-lg border-accent/30">
          <CardContent>
            <p className="text-xl text-muted-foreground mb-4">Your cart is currently empty.</p>
            <Link href="/" passHref>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                 <div className="w-24 h-24 relative mb-4 sm:mb-0 sm:mr-4 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                      // Enhanced AI Hint: Added 'cart item' context
                      data-ai-hint={`${item.category.toLowerCase()} cart item`}
                    />
                  </div>
                <div className="flex-grow mb-4 sm:mb-0">
                  <h2 className="text-lg font-semibold text-primary">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-md font-bold text-accent mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2 sm:ml-auto">
                   <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                   <Input
                     type="number"
                     min="1"
                     value={item.quantity}
                     onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                     className="h-8 w-14 text-center px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     aria-label={`Quantity for ${item.name}`}
                    />
                    <Button
                     variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                       <Plus className="h-4 w-4" />
                    </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20 shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="flex justify-between text-muted-foreground">
                   <span>Subtotal</span>
                   <span>${subtotal.toFixed(2)}</span>
                 </div>
                 {/* Add Tax and Shipping rows here if needed */}
                 <Separator />
                 <div className="flex justify-between font-bold text-lg text-primary">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Link href="/checkout" passHref className="w-full">
                  <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
