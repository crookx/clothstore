'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ImageGallery } from '@/components/ImageGallery';
import { fetchProduct } from '@/services/productService';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import { RelatedProducts } from '@/components/products/RelatedProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProduct() {
      // Type guard for params and id
      const productId = params?.id;
      if (typeof productId !== 'string') {
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Invalid product ID',
          variant: 'destructive',
        });
        return;
      }

      try {
        const fetchedProduct = await fetchProduct(productId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params?.id, toast]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ImageGallery 
          images={product.imageUrls || ['/placeholder.jpg']} 
          productName={product.name}
        />

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-accent">KES {product.price.toFixed(2)}</p>
          </div>

          <div className="prose max-w-none">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button 
            onClick={handleAddToCart} 
            className="w-full md:w-auto"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>

          {/* Product Features */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2">
              {product.features?.map((feature, index) => (
                <li key={index} className="text-muted-foreground">{feature}</li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <dl className="grid grid-cols-1 gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <dt className="font-medium min-w-[200px]">{key}:</dt>
                    <dd className="text-muted-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Related Products Section */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-16">
          <RelatedProducts productIds={product.relatedProducts} />
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-8 w-1/4" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <Card className="max-w-lg mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold text-primary mb-2">Product Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/products">Browse Products</Link>
      </Button>
    </Card>
  );
}