'use client';

import { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { Review } from '@/types/review';
import { getFirebaseServices } from '@/lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
}

export function ReviewSection({ productId, reviews }: ReviewSectionProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmitReview = async () => {
    if (!user) return;

    const services = getFirebaseServices();
    if (!services || !services.db) return;

    try {
      const reviewsRef = collection(services.db, 'reviews');
      await addDoc(reviewsRef, {
        productId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        rating,
        comment,
        createdAt: new Date(),
        helpful: 0
      });
      
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Customer Reviews</h3>
      
      {user && (
        <div className="space-y-4 p-4 bg-card rounded-lg">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer ${
                  star <= rating ? 'fill-yellow-400' : 'fill-none'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmitReview}>Submit Review</Button>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 bg-card rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={i < review.rating ? 'fill-yellow-400' : 'fill-none'}
                    />
                  ))}
                </div>
                <p className="font-semibold">{review.userName}</p>
                <p className="text-muted-foreground text-sm">
                  {review.createdAt.toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {review.helpful}
              </Button>
            </div>
            <p className="mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}