'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { ShoppingCart, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCart) {
      removeFromCart(product.id);
      toast({
        title: "Removed from Cart",
        description: `${product.name} has been removed from your cart.`
      });
    } else {
      addToCart(product);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`
      });
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`
      });
    }
  };

  return (
    <Link href={`/products/${product.id}`}> {/* Changed from /product to /products */}
      <Card 
        className={cn(
          "group relative overflow-hidden rounded-lg transition-all duration-300",
          "hover:shadow-lg hover:-translate-y-1",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Main Product Image */}
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              isHovered && "scale-110"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay with Action Buttons */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center gap-4",
              "bg-black/40 opacity-0 transition-opacity duration-300",
              isHovered && "opacity-100"
            )}
          >
            <Button
              size="icon"
              variant={inCart ? "destructive" : "secondary"}
              className={cn(
                "h-12 w-12 rounded-full shadow-lg",
                "transform -translate-y-4 transition-all duration-300",
                isHovered && "translate-y-0"
              )}
              onClick={handleAddToCart}
            >
              <ShoppingCart className={cn(
                "h-6 w-6",
                inCart && "fill-current"
              )} />
            </Button>
            <Button
              size="icon"
              variant={inWishlist ? "destructive" : "secondary"}
              className={cn(
                "h-12 w-12 rounded-full shadow-lg",
                "transform translate-y-4 transition-all duration-300",
                isHovered && "translate-y-0"
              )}
              onClick={handleWishlist}
            >
              <Heart className={cn(
                "h-6 w-6",
                inWishlist && "fill-current"
              )} />
            </Button>
          </div>

          {/* Price Tag */}
          <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-full font-semibold">
            KES {product.price.toLocaleString()}
          </div>

          {/* Stock Status */}
          {product.stock <= 5 && (
            <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-full text-sm">
              {product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left`}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {product.colors?.map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
