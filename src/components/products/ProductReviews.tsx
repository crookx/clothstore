'use client';

import { useEffect, useState } from 'react';
import { Star, UserCircle } from 'lucide-react';
import { getProductReviews } from '@/lib/firebase/reviews';
import type { Review } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getProductReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, [productId]);

  if (loading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  if (!reviews.length) {
    return <p className="text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className="h-6 w-6" />
            <span className="font-medium">{review.userName}</span>
            {review.verified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {review.date.toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}