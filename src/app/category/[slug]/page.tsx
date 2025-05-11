'use client';

import { use, useEffect, useState } from 'react'; // Import 'use'
import { notFound } from 'next/navigation';
import { collection, query, where, getDocs, Firestore } from 'firebase/firestore'; // Import Firestore type
import { getFirebaseServices, firebaseInitializationError } from '@/lib/firebase/config'; // Corrected import
import { ProductGrid } from '@/components/ProductGrid';
import { getCategoryById } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';

// Get Firebase services once when the module loads
const firebaseServices = getFirebaseServices();
const db = firebaseServices?.db; // db can be Firestore | undefined

interface ResolvedPageParams {
  slug: string;
}

interface CategoryPageProps {
  // According to Next.js, for client component pages, the 'params' prop
  // can be a Promise that needs to be unwrapped with React.use().
  params: Promise<ResolvedPageParams>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams: ResolvedPageParams = use(params); // Unwrap the params object and assert its type
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for handling errors
  const category = getCategoryById(resolvedParams.slug); // Use the unwrapped slug

  useEffect(() => {
    if (!category) {
      notFound();
      return;
    }

    if (firebaseInitializationError) {
      console.error("Firebase initialization failed:", firebaseInitializationError.message);
      setError(`Firebase initialization failed: ${firebaseInitializationError.message}`);
      setIsLoading(false);
      return;
    }

    if (!db) {
      console.error("Firestore 'db' instance is not available. Firebase services might not have initialized correctly.");
      setError("Failed to connect to the database. Please try again later.");
      setIsLoading(false);
      return;
    }

    // At this point, db is known to be a Firestore instance.
    // We can use it directly or assign to a new const for clarity if TypeScript needs more hints.
    const currentDbInstance: Firestore = db;

    async function fetchProducts() {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const q = query(
          collection(currentDbInstance, 'products'), // Use the validated db instance
          where('categoryId', '==', category!.id)
        );

        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching products.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [category]); // db and firebaseInitializationError are from module scope, so they are stable

  if (!category) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <p className="text-muted-foreground mb-8">{category.description}</p>
      
      {error ? (
        <div className="text-center py-12 text-red-500">
          <p className="text-xl font-semibold">Could not load products</p>
          <p>{error}</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <ProductGrid 
          products={products}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}