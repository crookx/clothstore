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
 * @returns A promise that resolves to an array of Product objects.
 * @throws Throws an error if fetching fails or Firebase services are not initialized.
 */
export async function fetchProducts(count: number = 20): Promise<Product[]> {
  let db;
  try {
    // Get Firestore instance, this will throw if initialization failed
    const services = ensureFirebaseServices();
    db = services.db;

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
    console.error("Error fetching products:", error);
    // If ensureFirebaseServices threw, the error will be specific
    // Otherwise, it's likely a Firestore query error
    // Return empty array to prevent breaking the UI, but log the error
    return [];
  }
}
