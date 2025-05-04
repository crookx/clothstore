'use client';

import { Product } from '@/types/product';
import ProductCard from './product-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [category, setCategory] = useState<string>('all');

  const filteredProducts = category === 'all'
    ? products
    : products.filter(product => product.category.toLowerCase() === category);

  // Get unique categories for the filter dropdown
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div>
      <div className="mb-6 flex justify-end">
         <Select onValueChange={(value) => setCategory(value)} defaultValue="all">
           <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="Filter by Category" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Categories</SelectItem>
             {/* Dynamically generate categories based on products */}
             {categories.map(cat => (
               <SelectItem key={cat} value={cat.toLowerCase()}>
                 {cat}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
           filteredProducts.map((product) => (
             <ProductCard key={product.id} product={product} />
           ))
         ) : (
           <p className="col-span-full text-center text-muted-foreground">No products found in this category.</p>
         )}
      </div>
    </div>
  );
}
