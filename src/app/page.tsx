
import ProductList from '@/components/product/product-list';
import { fetchProducts } from '@/services/productService'; // Import the service
import { firebaseInitializationError } from '@/lib/firebase/config'; // Import error state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { AlertCircle } from 'lucide-react'; // Import Icon

export default async function Home() {

  // Check for Firebase Initialization Error First
  if (firebaseInitializationError) {
     console.error("Home Page: Firebase initialization failed:", firebaseInitializationError);
     return (
         <div className="container mx-auto px-4 py-8">
             <h1 className="text-3xl font-bold mb-8 text-center text-primary">Explore Our Universe of Baby Gear</h1>
             <Alert variant="destructive" className="max-w-xl mx-auto">
                 <AlertCircle className="h-4 w-4" />
                 <AlertTitle>Configuration Error</AlertTitle>
                 <AlertDescription>
                    Failed to load products because Firebase could not be initialized.
                    Please check the browser console for details and ensure your
                    <code>.env.local</code> file is configured correctly and the server restarted.
                 </AlertDescription>
             </Alert>
         </div>
     );
  }

  // If no initialization error, proceed to fetch products
  const products = await fetchProducts();

  // --- Comment for User ---
  // If you haven't populated your 'products' collection in Firestore,
  // `products` will be empty even if Firebase initialized correctly.
  // Use the seed script or manually add data to the Firebase console.

  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-8 text-center text-primary">Explore Our Universe of Baby Gear</h1>
       {products.length > 0 ? (
         <ProductList products={products} />
       ) : (
         <p className="text-center text-muted-foreground mt-10">
           Loading products or no products found. Please check your Firestore setup or add products via the admin panel.
         </p>
       )}
    </div>
  );
}
