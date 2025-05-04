'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types/product';
import { useCart } from '@/context/cart-context';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-accent/50">
       <CardHeader className="p-0 relative">
         <div className="aspect-video overflow-hidden">
             <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={300}
                className={cn(
                    "object-cover transition-transform duration-500 ease-in-out group-hover:scale-105",
                    "w-full h-full" // Ensure image fills the container
                )}
                data-ai-hint={`${product.category} product`}
             />
         </div>
        </CardHeader>
        <CardContent className="p-4">
         <CardTitle className="text-lg font-semibold mb-1 text-primary truncate">{product.name}</CardTitle>
         <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">{product.description}</CardDescription>
         <p className="text-lg font-bold text-accent">${product.price.toFixed(2)}</p>
       </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
