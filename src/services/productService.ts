// src/services/productService.ts
import { 
  collection, 
  getDocs, 
  query, 
  limit, 
  where, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { getFirebaseServices } from '@/lib/firebase/config';
import type { Product } from '@/types/product';

export interface FetchProductsOptions {
  limit?: number;
  featured?: boolean;
  category?: string;
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams();
    
    // Add query parameters if they exist
    if (options.limit) queryParams.append('limit', options.limit.toString());
    if (options.featured) queryParams.append('featured', options.featured.toString());
    if (options.category) queryParams.append('category', options.category);

    const response = await fetch(`/api/products?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable caching for fresh data
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch products');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Product fetch error:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  const services = getFirebaseServices();
  if (!services?.db) throw new Error('Firebase services not available');

  try {
    const productRef = doc(services.db, 'products', productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return null;
    }

    const data = productDoc.data();
    return {
      id: productDoc.id,
      ...data,
      imageUrls: data.imageUrls || [] // Ensure imageUrls is always an array
    } as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function fetchRelatedProducts(productIds: string[]): Promise<Product[]> {
  const services = getFirebaseServices();
  if (!services) throw new Error('Firebase services not available');
  if (!productIds?.length) return [];
  
  try {
    const products: Product[] = [];
    
    if (!services.db) throw new Error('Firestore instance is not available');

    // Process in chunks of 10 due to Firestore limitation
    for (let i = 0; i < productIds.length; i += 10) {
      const chunk = productIds.slice(i, i + 10);
      const productsRef = collection(services.db, 'products');
      const q = query(productsRef, where('id', 'in', chunk));
      const querySnapshot = await getDocs(q);
      
      products.push(...querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          imageUrls: data.imageUrls || [] // Ensure imageUrls is always an array
        } as Product;
      }));
    }
    
    return products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  const services = getFirebaseServices();
  if (!services?.db) throw new Error('Firebase services not available');

  const docRef = doc(services.db, 'products', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Product not found');
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    imageUrls: data.imageUrls || [] // Ensure imageUrls is always an array
  } as Product;
}
