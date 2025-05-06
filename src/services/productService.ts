
// src/services/productService.ts
import { getFirebaseServices } from '@/lib/firebase/config'; // Import the function to get services
import type { Product } from '@/types/product';
import { collection, getDocs, query, limit, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

/**
 * Fetches a list of products from the Firestore database.
 *
 * Assumes a 'products' collection exists in Firestore, where each document
 * matches the Product interface structure.
 *
 * @param count - The maximum number of products to fetch. Defaults to 20.
 * @returns A promise that resolves to an array of Product objects, or null if Firebase services are unavailable or fetching fails.
 * @throws Will re-throw critical Firestore errors after logging them.
 */
export async function fetchProducts(count: number = 20): Promise<Product[] | null> {
  const services = getFirebaseServices();
  if (!services) {
    console.error("fetchProducts: Firebase services are unavailable due to initialization failure.");
    // Return null because the core service needed is missing. The error is already logged in config.
    return null;
  }
  const { db } = services;

  try {
    const productsCollectionRef = collection(db, 'products');
    const q = query(productsCollectionRef, limit(count));
    const querySnapshot = await getDocs(q);

    // Check if the snapshot is empty
    if (querySnapshot.empty) {
        console.log("fetchProducts: No products found in the 'products' collection.");
        return []; // Return an empty array if no documents exist
    }

    const products = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>): Product => {
      const data = doc.data();
      // Provide defaults for potentially missing fields
      return {
        id: doc.id,
        name: data.name || 'Unnamed Product',
        description: data.description || 'No description available.',
        price: typeof data.price === 'number' ? data.price : 0,
        category: data.category || 'Uncategorized',
        imageUrl: data.imageUrl || 'https://picsum.photos/seed/placeholder/400/300', // Default placeholder
        stock: typeof data.stock === 'number' ? data.stock : 0,
        // Ensure all necessary fields from the Product type are mapped
      };
    });

    return products;
  } catch (error: any) {
    // Log Firestore query errors specifically
    console.error("Error fetching products from Firestore:", error);

     // Check for permission denied errors specifically
     if (error.code === 'permission-denied') {
        console.error("Firestore permission denied. Check security rules for the 'products' collection.");
        // Returning null might be appropriate here as the data is inaccessible
        // Alternatively, throw a specific error if the calling component needs to know
         // throw new Error("Permission denied while fetching products. Check Firestore rules.");
         return null; // Let the caller handle the null case (e.g., show an error message)
     }

    // For other errors, re-throw to indicate a more general fetch failure
    throw new Error(`Failed to fetch products from Firestore. Original error: ${error.message || String(error)}`);
  }
}
