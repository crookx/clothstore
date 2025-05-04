// src/services/orderService.ts
'use server'; // Indicate this runs on the server

import { db, auth } from '@/lib/firebase/config'; // Import db and auth
import type { CartItem } from '@/types/product';
import type { User } from 'firebase/auth'; // Import User type
import { collection, addDoc, serverTimestamp, doc, getDoc, writeBatch, runTransaction } from 'firebase/firestore';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
}

interface OrderData {
  userId: string | null; // Allow anonymous orders initially, or enforce login
  email: string; // Customer email
  shippingInfo: ShippingInfo;
  items: CartItem[]; // Array of items in the order
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Order status
  createdAt: any; // Firestore server timestamp
  // Add paymentIntentId or similar if using Stripe/other gateways
  // paymentIntentId?: string;
}

/**
 * Saves an order to the Firestore database and updates product stock.
 *
 * Assumes:
 * - An 'orders' collection for storing order documents.
 * - A 'products' collection where stock needs to be updated.
 * - Firebase auth is initialized for getting the current user ID (optional).
 *
 * @param shippingInfo - The customer's shipping information.
 * @param cart - The array of CartItem objects representing the order.
 * @param subtotal - The order subtotal.
 * @param shippingCost - The shipping cost.
 * @param tax - The tax amount.
 * @param total - The total order amount.
 * @param currentUser - The currently authenticated Firebase user (optional).
 * @returns A promise that resolves to the ID of the newly created order document.
 * @throws Throws an error if saving the order or updating stock fails.
 */
export async function placeOrder(
  shippingInfo: ShippingInfo,
  cart: CartItem[],
  subtotal: number,
  shippingCost: number,
  tax: number,
  total: number,
  // paymentIntentId?: string, // Uncomment if using payment gateway ID
  currentUser?: User | null // Pass the current user object
): Promise<string> {
  if (!cart || cart.length === 0) {
    throw new Error("Cannot place an empty order.");
  }

  const orderData: OrderData = {
    userId: currentUser ? currentUser.uid : null, // Get user ID if logged in
    email: shippingInfo.email, // Use provided email
    shippingInfo,
    items: cart,
    subtotal,
    shippingCost,
    tax,
    total,
    status: 'pending', // Initial status
    createdAt: serverTimestamp(), // Use Firestore server timestamp
    // paymentIntentId: paymentIntentId || undefined, // Uncomment if using payment gateway
  };

  try {
    // --- Firestore Transaction for Atomicity ---
    // Use a transaction to ensure that either the order is created AND stock is updated,
    // or neither operation happens if there's an error (e.g., insufficient stock).

    const orderId = await runTransaction(db, async (transaction) => {
      // 1. Check stock and prepare updates
      const stockUpdates: { ref: any; newStock: number }[] = [];
      for (const item of cart) {
        const productRef = doc(db, 'products', item.id);
        const productSnap = await transaction.get(productRef);

        if (!productSnap.exists()) {
          throw new Error(`Product with ID ${item.id} (${item.name}) not found.`);
        }

        const currentStock = productSnap.data().stock as number;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`);
        }

        const newStock = currentStock - item.quantity;
        stockUpdates.push({ ref: productRef, newStock: newStock });
        // transaction.update(productRef, { stock: newStock }); // Update stock within transaction
      }

      // 2. Create the order document
      const ordersCollectionRef = collection(db, 'orders');
      const newOrderRef = doc(ordersCollectionRef); // Generate a new document reference *with* an ID
      transaction.set(newOrderRef, orderData); // Set the order data

      // 3. Apply stock updates
      stockUpdates.forEach(update => {
          transaction.update(update.ref, { stock: update.newStock });
      });


      return newOrderRef.id; // Return the ID of the newly created order
    });


    console.log("Order placed successfully with ID:", orderId);
    return orderId;

  } catch (error) {
    console.error("Error placing order in Firestore:", error);
    // Handle specific errors (like stock issues) or re-throw a generic one
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
        throw error; // Re-throw stock error to be handled by UI
    }
     if (error instanceof Error && error.message.includes('not found')) {
            throw error; // Re-throw product not found error
     }
    throw new Error("Failed to place order. Please try again."); // Generic error
  }
}
