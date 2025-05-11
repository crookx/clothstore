'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { PLACEHOLDER_IMAGE_URL } from '@/lib/constants';

interface CartItemProps {
  item: Product & { quantity: number };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="relative w-24 h-24">
        <Image
          src={item.imageUrls?.[0] || PLACEHOLDER_IMAGE_URL}
          alt={item.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
          >
            -
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
          >
            +
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            className="ml-4"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}