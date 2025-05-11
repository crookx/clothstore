'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/types/product';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseServices } from '@/lib/firebase/config';

interface RelatedProductsProps {
  productIds: string[];
}

export function RelatedProducts({ productIds }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedProducts() {
      const services = getFirebaseServices();
      if (!services || !productIds.length) return;

      try {
        const productsData = await Promise.all(
          productIds.map(async (id) => {
            const docRef = doc(services.db, 'products', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              return { id: docSnap.id, ...docSnap.data() } as Product;
            }
            return null;
          })
        );

        setProducts(productsData.filter((p): p is Product => p !== null));
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [productIds]);

  if (!products.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}