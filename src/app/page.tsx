
import ProductList from '@/components/product/product-list';
import ProductListSkeleton from '@/components/product/product-list-skeleton'; // Import the skeleton
import { fetchProducts } from '@/services/productService'; // Import the service
import { firebaseInitializationError } from '@/lib/firebase/config'; // Import error state
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
        {/* <Link href="/products" passHref>
          <Button variant="secondary" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Shop All Categories
          </Button>
        </Link> */}
      </div>
    </div>
  );
}

// --- Product Loader Component (Server Component) ---
async function ProductLoader() {
  // Check for Firebase Initialization Error First
  if (firebaseInitializationError) {
    // Error is already logged during initialization in config.ts
    // We show a user-friendly message here.
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Service Unavailable</AlertTitle>
        <AlertDescription>
           Could not load products due to a configuration issue. Please try again later or contact support if the problem persists.
           Check the browser console for more specific error details related to Firebase initialization.
        </AlertDescription>
      </Alert>
    );
  }

  // If no initialization error, proceed to fetch products
  const products = await fetchProducts(); // fetchProducts now returns [] or null on error

  if (products === null) {
     // This case means ensureFirebaseServices failed *after* the initial check,
     // or fetchProducts itself had a critical error.
     return (
       <Alert variant="destructive" className="max-w-2xl mx-auto mt-10">
         <AlertCircle className="h-4 w-4" />
         <AlertTitle>Error Loading Products</AlertTitle>
         <AlertDescription>
           There was a problem fetching product data from the database. Please try refreshing the page.
         </AlertDescription>
       </Alert>
     );
  }


  // --- Comment for User ---
  // If you haven't populated your 'products' collection in Firestore,
  // `products` will be empty even if Firebase initialized correctly.
  // Use the seed script (`npm run seed:firestore` after setup) or manually add data.

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">Explore Our Galaxy of Gear</h2>
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <p className="text-center text-muted-foreground mt-10">
           Our product universe is currently empty! Use the seed script (`npm run seed:firestore` after setup) or add products via the Admin dashboard to populate the shop.
        </p>
      )}
    </>
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
