'use client';

import { useWishlist } from '@/context/wishlist-context';
import { ProductGrid } from '@/components/ProductGrid'; // Updated import path
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        
        {wishlist.length > 0 ? (
          <ProductGrid products={wishlist} />
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-4">
              Save items you love and want to buy later
            </p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}