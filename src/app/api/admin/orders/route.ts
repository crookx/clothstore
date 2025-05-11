import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { verifySession } from '@/lib/auth/server';

export async function GET(request: Request) {
  try {
    // Verify admin session
    await verifySession();

    const db = getFirestore();
    const ordersRef = db.collection('orders');
    
    // Get all orders, sorted by creation date
    const snapshot = await ordersRef
      .orderBy('createdAt', 'desc')
      .get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString()
    }));

    return NextResponse.json(orders);

  } catch (error) {
    console.error('Orders API error:', error);
    
    if (error instanceof Error && (error.message === 'Not authenticated' || error.message === 'Not authorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}