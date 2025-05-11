'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/types/cart';

export function Cart() {
  const { items, removeItem, updateQuantity } = useCart();

  const total = items.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  );

  return (
    <div className="flex flex-col gap-4">
      {items.map((item: CartItem) => (
        <div key={item.id} className="flex justify-between items-center p-4 border rounded">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-500">${item.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
            >
              -
            </Button>
            <span>{item.quantity}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="font-medium">Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}