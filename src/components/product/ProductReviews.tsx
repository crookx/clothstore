'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
}

export function ProductReviews({ productId, reviews: initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReview)
      });

      if (!response.ok) throw new Error('Failed to submit review');

      const newReviewData = await response.json();
      setReviews(prev => [newReviewData, ...prev]);
      setNewReview({ rating: 0, comment: '' });
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Customer Reviews</h3>

      {user && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitReview}
          className="space-y-4"
        >
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                className="text-yellow-400 focus:outline-none"
              >
                {star <= newReview.rating ? (
                  <Star className="fill-current" />
                ) : (
                  <Star />
                )}
              </button>
            ))}
          </div>
          <Textarea
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Write your review..."
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={isSubmitting || !newReview.rating}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </motion.form>
      )}

      <AnimatePresence>
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={i < review.rating ? "fill-current" : ""}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  by {review.userName}
                </span>
              </div>
              <p className="text-sm">{review.comment}</p>
              <span className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}