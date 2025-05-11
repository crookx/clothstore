import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin-firestore';

export async function GET() {
  try {
    // Get collection references
    const productsRef = adminDb.collection('products');
    const ordersRef = adminDb.collection('orders');
    const usersRef = adminDb.collection('users');

    // Get counts
    const [productsCount, ordersCount, usersCount] = await Promise.all([
      productsRef.count().get(),
      ordersRef.count().get(),
      usersRef.count().get()
    ]);

    // Get recent orders
    const recentOrdersSnap = await ordersRef
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    // Get top products
    const topProductsSnap = await productsRef
      .orderBy('sales', 'desc')
      .limit(5)
      .get();

    // Calculate total revenue
    const totalRevenue = (await ordersRef.get()).docs
      .reduce((sum, doc) => sum + (doc.data().total || 0), 0);

    return NextResponse.json({
      totalProducts: productsCount.data().count,
      totalOrders: ordersCount.data().count,
      totalUsers: usersCount.data().count,
      totalRevenue,
      recentOrders: recentOrdersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })),
      topProducts: topProductsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' }, 
      { status: 500 }
    );
  }
}