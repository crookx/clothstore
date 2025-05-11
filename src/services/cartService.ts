import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import type { CartItem } from '@/types';

const db = getFirestore();

export async function getCartFromDb(userId: string): Promise<CartItem[]> {
  try {
    const cartDoc = await getDoc(doc(db, 'carts', userId));
    return cartDoc.exists() ? cartDoc.data().items : [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

export async function saveCartToDb(userId: string, items: CartItem[]): Promise<void> {
  try {
    await setDoc(doc(db, 'carts', userId), { items }, { merge: true });
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
}

export async function addToCart(userId: string, item: CartItem): Promise<CartItem[]> {
  try {
    const currentCart = await getCartFromDb(userId);
    const existingItemIndex = currentCart.findIndex(i => i.productId === item.productId);

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += item.quantity;
    } else {
      currentCart.push(item);
    }

    await saveCartToDb(userId, currentCart);
    return currentCart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function removeFromCart(userId: string, productId: string): Promise<CartItem[]> {
  try {
    const currentCart = await getCartFromDb(userId);
    const updatedCart = currentCart.filter(item => item.productId !== productId);
    await saveCartToDb(userId, updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

export async function updateCartItemQuantity(
  userId: string, 
  productId: string, 
  quantity: number
): Promise<CartItem[]> {
  try {
    const currentCart = await getCartFromDb(userId);
    const updatedCart = currentCart.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    await saveCartToDb(userId, updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw error;
  }
}