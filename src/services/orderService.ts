// src/services/orderService.ts
'use server'; // Indicate this runs on the server

import { getFirebaseServices } from '@/lib/firebase/config'; // Import the function to get services
import type { CartItem } from '@/types/product';
import type { User } from 'firebase/auth'; // Import User type
import { collection, addDoc, serverTimestamp, doc, runTransaction, Timestamp, updateDoc, query, where, getDocs, getDoc } from 'firebase/firestore';
import { Order } from '@/types/order';
import { Product } from '@/types/product';
import { db } from '@/lib/db';
import { sendOrderConfirmation, sendOrderStatusUpdate } from '@/lib/email';

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
  createdAt: Timestamp; // Firestore server timestamp - Use Timestamp type
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
 * @throws Throws an error if saving the order or updating stock fails, or if Firebase services are not initialized.
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

  const services = getFirebaseServices();
  if (!services) {
     // Error is already logged by getFirebaseServices
    throw new Error("Order placement failed: Core services are unavailable.");
  }
  const { db } = services;

  // Prepare order data before the transaction
   const orderData: Omit<OrderData, 'createdAt'> = { // Omit createdAt initially
    userId: currentUser ? currentUser.uid : null, // Get user ID if logged in
    email: shippingInfo.email, // Use provided email
    shippingInfo,
    items: cart,
    subtotal,
    shippingCost,
    tax,
    total,
    status: 'pending', // Initial status
    // paymentIntentId: paymentIntentId || undefined, // Uncomment if using payment gateway
   };


  try {
    // --- Firestore Transaction for Atomicity ---
    const orderId = await runTransaction(db, async (transaction) => {
      // 1. Check stock and prepare updates
      const stockUpdates: { ref: any; newStock: number }[] = [];
      for (const item of cart) {
        const productRef = doc(db, 'products', item.id);
        const productSnap = await transaction.get(productRef);

        if (!productSnap.exists()) {
          // Make error more specific
          throw new Error(`Product not found: ${item.name} (ID: ${item.id}). Order cannot be placed.`);
        }

        const currentStock = productSnap.data().stock as number;
        if (currentStock === undefined || currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock ?? 0}, Requested: ${item.quantity}. Order cannot be placed.`);
        }

        const newStock = currentStock - item.quantity;
        stockUpdates.push({ ref: productRef, newStock: newStock });
      }

      // 2. Create the order document within the transaction
      const ordersCollectionRef = collection(db, 'orders');
      const newOrderRef = doc(ordersCollectionRef); // Firestore automatically generates ID
      // Add createdAt using serverTimestamp() *inside* the transaction set
      transaction.set(newOrderRef, { ...orderData, createdAt: serverTimestamp() });


      // 3. Apply stock updates within the transaction
      stockUpdates.forEach(update => {
          transaction.update(update.ref, { stock: update.newStock });
      });

      return newOrderRef.id; // Return the generated ID
    });

    console.log("Order placed successfully with ID:", orderId);
    return orderId;

  } catch (error) {
    console.error("Error during order placement transaction:", error);
    // Re-throw specific errors or a generic one
    if (error instanceof Error) {
        // Check for known error types
        if (error.message.includes('Insufficient stock') ||
            error.message.includes('Product not found') ||
            error.message.includes("transaction")) { // Catch potential transaction errors
            // Throw specific, user-friendly messages if possible
             throw new Error(`Order failed: ${error.message}`);
        }
         // Handle potential permission errors during transaction
         if ((error as any).code === 'permission-denied') {
             console.error("Firestore permission denied during order placement. Check security rules for 'orders' and 'products' collections.");
             throw new Error("Order failed due to permission issues. Please contact support.");
         }
    }
    // Throw a more generic error for other unexpected issues
    throw new Error("Failed to place order due to an unexpected error. Please try again later.");
  }
}

/**
 * Creates a new order and updates product inventory.
 *
 * @param orderData - The order data excluding id, status, and createdAt.
 * @returns The ID of the newly created order.
 * @throws Throws an error if stock is insufficient or if the operation fails.
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const orderRef = db.collection('orders').doc();
  const now = new Date().toISOString();

  const order: Order = {
    ...orderData,
    id: orderRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await orderRef.set(order);
  await sendOrderConfirmation(order);

  return order;
}

/**
 * Retrieves orders for a specific user.
 *
 * @param userId - The ID of the user.
 * @returns An array of orders belonging to the user.
 */
export async function getUserOrders(userId: string) {
  const ordersQuery = query(
    collection(db, 'orders'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Order));
}

/**
 * Updates the status of an order.
 *
 * @param orderId - The ID of the order to update.
 * @param status - The new status of the order.
 */
export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const orderRef = db.collection('orders').doc(orderId);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }

  const order = orderDoc.data() as Order;
  await orderRef.update({
    status,
    updatedAt: new Date().toISOString(),
  });

  await sendOrderStatusUpdate({
    ...order,
    status,
  });

  return {
    ...order,
    status,
  };
}
