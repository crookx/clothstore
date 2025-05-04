import { Product } from '@/types/product';
import ProductCard from './product-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  // Add state and filtering logic here later

  return (
    <div>
      <div className="mb-6 flex justify-end">
         <Select>
           <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="Filter by Category" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Categories</SelectItem>
             {/* Dynamically generate categories based on products */}
             {[...new Set(products.map(p => p.category))].map(category => (
               <SelectItem key={category} value={category.toLowerCase()}>
                 {category}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
