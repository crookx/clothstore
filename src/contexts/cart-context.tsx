'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { saveCartToDb, getCartFromDb } from '@/services/cartService';
import type { CartItem } from '@/types/cart';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function loadCart() {
      if (user) {
        try {
          const cartItems = await getCartFromDb(user.uid);
          const validatedItems = cartItems.map((item: any): CartItem => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            sku: item.sku
          }));
          setItems(validatedItems);
        } catch (error) {
          console.error('Error loading cart:', error);
          toast({
            title: 'Error',
            description: 'Failed to load your cart',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setItems([]);
        setIsLoading(false);
      }
    }

    loadCart();
  }, [user, toast]);

  const addItem = (item: CartItem) => {
    setItems(current => {
      const existing = current.find(i => i.id === item.id);
      if (existing) {
        return current.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(current => 
      quantity === 0
        ? current.filter(item => item.id !== id)
        : current.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      await saveCartToDb(user.uid, []);
      setItems([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive',
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isLoading
      }}
    >
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};