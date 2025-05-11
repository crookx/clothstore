'use client';

import { useWishlist } from '@/context/wishlist-context';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  if (!wishlist.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-2xl font-semibold">Your wishlist is empty</h2>
        <p className="mt-2 text-gray-600">Save items you love to your wishlist</p>
        <Link href="/products">
          <Button className="mt-8">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="group relative border rounded-lg p-4 space-y-4">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <Image
                  src={product.imageUrls[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => addToCart(product)}
                disabled={isInCart(product.id)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeFromWishlist(product.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}