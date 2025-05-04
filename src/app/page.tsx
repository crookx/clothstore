import ProductList from '@/components/product/product-list';
import { fetchProducts } from '@/services/productService'; // Import the service

export default async function Home() {
  // Fetch products from Firestore using the service function
  // This now runs on the server thanks to Next.js App Router (Server Component)
  const products = await fetchProducts();

  // --- Comment for User ---
  // If you haven't set up your Firebase config in src/lib/firebase/config.ts
  // or populated your 'products' collection in Firestore, `products` will be empty.
  // Make sure your Firestore database has a 'products' collection with documents
  // matching the structure described in src/services/productService.ts.
  // You can add some sample data manually in the Firebase console to test.

  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-8 text-center text-primary">Explore Our Universe of Baby Gear</h1>
       {products.length > 0 ? (
         <ProductList products={products} />
       ) : (
         <p className="text-center text-muted-foreground mt-10">
           Loading products or no products found. Please check your Firestore setup.
         </p>
       )}
    </div>
  );
}
