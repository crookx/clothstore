import * as React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  value: number;
  max?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: number) => void;
  className?: string;
}

export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ value, max = 5, readonly = false, size = 'md', onChange, className }, ref) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const renderStar = (index: number) => {
      const filled = (hoverValue ?? value) >= index + 1;
      
      return (
        <button
          key={index}
          type="button"
          className={cn(
            'transition-colors',
            filled ? 'text-yellow-400' : 'text-gray-300',
            !readonly && 'hover:text-yellow-400',
            readonly && 'cursor-default'
          )}
          disabled={readonly}
          onMouseEnter={() => !readonly && setHoverValue(index + 1)}
          onMouseLeave={() => !readonly && setHoverValue(null)}
          onClick={() => !readonly && onChange?.(index + 1)}
        >
          <Star className={sizeClasses[size]} />
        </button>
      );
    };

    return (
      <div
        ref={ref}
        className={cn('flex gap-1', className)}
        onMouseLeave={() => !readonly && setHoverValue(null)}
      >
        {Array.from({ length: max }, (_, i) => renderStar(i))}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';