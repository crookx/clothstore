'use client';

import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export default function Header() {
  const { cart } = useCart();
  const [itemCount, setItemCount] = useState(0);

  // Avoid hydration mismatch by updating count client-side
  useEffect(() => {
    setItemCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, [cart]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary">AstraBaby</span>
        </Link>
        <nav className="flex items-center space-x-4">
          {/* Add navigation links here if needed */}
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {itemCount > 0 && (
                 <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          {/* Add User Auth button later */}
        </nav>
      </div>
    </header>
  );
}
