import type { Product } from './product';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}