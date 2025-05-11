import { getFirebaseServices } from './config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { Review } from '@/types/product';

export async function getProductReviews(productId: string): Promise<Review[]> {
  const services = getFirebaseServices();
  if (!services) throw new Error('Firebase not initialized');

  const q = query(
    collection(services.db, 'reviews'),
    where('productId', '==', productId),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Review));
}