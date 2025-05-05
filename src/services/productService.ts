// src/services/productService.ts
import { ensureFirebaseServices } from '@/lib/firebase/config'; // Import the helper
import type { Product } from '@/types/product';
import { collection, getDocs, query, limit, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

/**
 * Fetches a list of products from the Firestore database.
 *
 * Assumes a 'products' collection exists in Firestore, where each document
 * matches the Product interface structure.
 *
 * @param count - The maximum number of products to fetch. Defaults to 20.
 * @returns A promise that resolves to an array of Product objects, or null if Firebase services are unavailable.
 * @throws Throws an error if fetching fails (but not if Firebase init failed).
 */
export async function fetchProducts(count: number = 20): Promise<Product[] | null> { // Return type updated
  const services = ensureFirebaseServices();
  if (!services) {
    console.error("fetchProducts: Firebase services are unavailable.");
    return null; // Return null if Firebase initialization failed
  }
  const { db } = services;

  try {
    const productsCollectionRef = collection(db, 'products');
    const q = query(productsCollectionRef, limit(count));
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>): Product => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unnamed Product',
        description: data.description || 'No description available.',
        price: typeof data.price === 'number' ? data.price : 0,
        category: data.category || 'Uncategorized',
        imageUrl: data.imageUrl || 'https://picsum.photos/seed/placeholder/400/300',
        stock: typeof data.stock === 'number' ? data.stock : 0,
      };
    });

    return products;
  } catch (error) {
    // Log Firestore query errors specifically
    console.error("Error fetching products from Firestore:", error);
    // Throw the error for the calling component to potentially handle differently
    // than the initialization error.
    throw new Error(`Failed to fetch products from Firestore. Original error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
