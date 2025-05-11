import { db } from '@/lib/firebase/config';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

export interface SupportTicket {
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

export async function createSupportTicket(
  ticket: Omit<SupportTicket, 'status'>
) {
  try {
    const ticketRef = await addDoc(collection(db, 'support_tickets'), {
      ...ticket,
      status: 'open',
      createdAt: new Date().toISOString()
    });

    return ticketRef.id;
  } catch (error) {
    console.error('Failed to create support ticket:', error);
    throw error;
  }
}

export async function getUserTickets(userId: string) {
  const q = query(
    collection(db, 'support_tickets'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}