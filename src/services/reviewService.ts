import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  doc, 
  updateDoc,
  getDocs 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Review } from '@/types/product';

export async function fetchReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('productId', '==', productId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  try {
    const reviewData = {
      ...review,
      createdAt: new Date().toISOString(),
    };

    const reviewRef = await addDoc(collection(db, 'reviews'), reviewData);

    // Update product average rating
    const productRef = doc(db, 'products', review.productId);
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('productId', '==', review.productId)
    );
    
    const reviewsSnapshot = await getDocs(reviewsQuery);
    const reviews = reviewsSnapshot.docs.map(doc => doc.data() as Review);
    
    const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
    
    await updateDoc(productRef, {
      averageRating,
      totalReviews: reviews.length
    });

    return reviewRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

export async function updateReviewHelpful(reviewId: string, helpful: number): Promise<void> {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, { helpful });
  } catch (error) {
    console.error("Error updating review helpful count:", error);
    throw error;
  }
}