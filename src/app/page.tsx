
import ProductList from '@/components/product/product-list';
import ProductListSkeleton from '@/components/product/product-list-skeleton'; // Import the skeleton
import { fetchProducts } from '@/services/productService'; // Import the service
import { getFirebaseServices, firebaseInitializationError } from '@/lib/firebase/config'; // Import config function and error state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { AlertCircle, Rocket } from 'lucide-react'; // Import Icon
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// --- Hero Section Component ---
function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-primary via-primary/90 to-blue-950 text-primary-foreground py-16 mb-12 rounded-lg shadow-xl text-center">
      <div className="container mx-auto px-4">
        <Rocket className="h-16 w-16 mx-auto mb-4 text-accent animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to AstraBaby</h1>
        <p className="text-lg md:text-xl mb-8 text-primary-foreground/80">
          Explore our universe of futuristic and comfy gear for your little star.
        </p>
        {/* Optional: Add a Call to Action Button */}
        {/* <Link href="#products" passHref>
          <Button variant="secondary" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
             Shop Now
          </Button>
        </Link> */}
      </div>
    </div>
  );
}


// --- Product Loader Component (Server Component) ---
async function ProductLoader() {
  // Check for Firebase Initialization Error *First*
  // This error is determined when the config module is loaded.
  if (firebaseInitializationError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Configuration Error</AlertTitle>
        <AlertDescription>
          {firebaseInitializationError.message} {/* Display the detailed error from config */}
          <br /><br />
          Please ensure your <code>.env.local</code> file is correctly set up and restart the server.
        </AlertDescription>
      </Alert>
    );
  }

  // If initialization seems okay, *try* to fetch products
  let products: Awaited<ReturnType<typeof fetchProducts>>;
  let fetchError: string | null = null;

  try {
    products = await fetchProducts(); // fetchProducts now handles internal errors and returns [] or null
  } catch (err) {
    // Catch errors thrown by fetchProducts (e.g., actual Firestore query errors)
    console.error("ProductLoader: Error fetching products:", err);
    products = null; // Indicate fetch failure
    fetchError = err instanceof Error ? err.message : "An unknown error occurred while fetching products.";
  }


  // Handle cases where fetching failed or returned null/empty
  if (products === null) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Products</AlertTitle>
        <AlertDescription>
          {fetchError || "Could not load products at this time. The connection to the database might be unavailable or permissions might be incorrect."}
          <br /><br />
           Please try refreshing the page or check the console for more details. If you are the administrator, ensure the Firestore API is enabled and security rules allow reading the 'products' collection.
        </AlertDescription>
      </Alert>
    );
  }

  if (products.length === 0) {
      return (
        <div className="text-center text-muted-foreground mt-10 border rounded-lg p-6 max-w-xl mx-auto bg-card">
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Our Shelves Are Being Stocked!</h3>
            <p className="mb-4">No products found in the database yet.</p>
             <p className="text-sm">
                 If you're the administrator, you can add products using the Admin Dashboard or run the seed script (`npm run seed:firestore` after setting up the service account) to populate the shop.
             </p>
        </div>
      );
  }

  // --- Render Product List if successful ---
  return (
    <section id="products">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">Explore Our Galaxy of Gear</h2>
      <ProductList products={products} />
    </section>
  );
}


// --- Main Home Page ---
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Display the Hero Section */}
      <HeroSection />

      {/* Use Suspense to show a loading skeleton while products are fetched */}
      <Suspense fallback={<ProductListSkeleton count={8} />}>
         {/* @ts-expect-error Server Component */}
        <ProductLoader />
      </Suspense>
    </div>
  );
}
