import { db } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { sendNotification } from './emailService';

export interface ReturnRequest {
  orderId: string;
  userId: string;
  reason: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export async function createReturnRequest(
  request: Omit<ReturnRequest, 'status'>
) {
  try {
    const returnRef = await addDoc(collection(db, 'returns'), {
      ...request,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Get order details for email
    const orderRef = doc(db, 'orders', request.orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      const orderData = orderSnap.data();
      
      // Send notification
      await sendNotification({
        type: 'return_approved',
        to: orderData.customerEmail,
        subject: `Return Request Received for Order ${request.orderId}`,
        data: {
          orderId: request.orderId,
          returnId: returnRef.id
        }
      });
    }

    return returnRef.id;
  } catch (error) {
    console.error('Failed to create return request:', error);
    throw error;
  }
}