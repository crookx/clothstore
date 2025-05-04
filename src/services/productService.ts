// src/services/productService.ts
import { db } from '@/lib/firebase/config';
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
 * @throws Throws an error if fetching fails.
 */
export async function fetchProducts(count: number = 20): Promise<Product[]> {
  try {
    // --- Firestore Collection Structure ---
    // Make sure you have a collection named 'products' in your Firestore database.
    // Each document in this collection should have fields matching the 'Product' type:
    // - id: string (The document ID can serve as the product ID)
    // - name: string
    // - description: string
    // - price: number
    // - category: string
    // - imageUrl: string (URL to the product image)
    // - stock: number

    const productsCollectionRef = collection(db, 'products');
    // Create a query to fetch products, limiting the number returned
    const q = query(productsCollectionRef, limit(count));
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>): Product => {
      const data = doc.data();
      // Map Firestore document data to the Product type
      return {
        id: doc.id, // Use the document ID as the product ID
        name: data.name || 'Unnamed Product',
        description: data.description || 'No description available.',
        price: typeof data.price === 'number' ? data.price : 0,
        category: data.category || 'Uncategorized',
        imageUrl: data.imageUrl || 'https://picsum.photos/seed/placeholder/400/300', // Default placeholder
        stock: typeof data.stock === 'number' ? data.stock : 0,
      };
    });

    return products;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    // Optionally, return an empty array or re-throw the error based on desired handling
    // throw new Error("Failed to fetch products.");
    return []; // Return empty array on failure for now
  }
}
