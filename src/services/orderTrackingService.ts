import { db } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { sendNotification } from './emailService';

export interface TrackingUpdate {
  orderId: string;
  status: 'processing' | 'shipped' | 'delivered' | 'returned';
  location?: string;
  description: string;
  timestamp: string;
}

export async function updateOrderTracking(
  orderId: string,
  update: Omit<TrackingUpdate, 'orderId' | 'timestamp'>
) {
  try {
    // Add tracking update
    await addDoc(collection(db, 'order_tracking'), {
      orderId,
      ...update,
      timestamp: new Date().toISOString()
    });

    // Update order status
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      const orderData = orderSnap.data();
      
      // Send email notification
      await sendNotification({
        type: 'shipping_update',
        to: orderData.customerEmail,
        subject: `Order ${orderId} ${update.status}`,
        data: {
          orderId,
          status: update.status,
          description: update.description
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to update tracking:', error);
    return false;
  }
}