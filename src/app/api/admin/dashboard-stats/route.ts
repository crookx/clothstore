import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin-config';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify admin session
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!decodedClaims.admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const db = getFirestore();

    // Get all required data
    const [
      ordersSnapshot,
      usersSnapshot,
      productsSnapshot,
      salesSnapshot
    ] = await Promise.all([
      db.collection('orders').get(),
      db.collection('users').get(),
      db.collection('products').get(),
      db.collection('sales').get()
    ]);

    // Calculate sales data for the last 7 days
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const salesData = last7Days.map(date => ({
      name: date,
      total: salesSnapshot.docs
        .filter(doc => doc.data().createdAt.toDate().toISOString().startsWith(date))
        .reduce((sum, doc) => sum + (doc.data().amount || 0), 0)
    }));

    // Calculate orders data
    const orderData = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString()
    }));

    // Calculate total revenue
    const totalRevenue = salesSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().amount || 0),
      0
    );

    // Calculate month-over-month growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const thisMonthSales = salesSnapshot.docs
      .filter(doc => doc.data().createdAt.toDate() > lastMonth)
      .reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

    const previousMonth = new Date(lastMonth);
    previousMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthSales = salesSnapshot.docs
      .filter(doc => {
        const date = doc.data().createdAt.toDate();
        return date <= lastMonth && date > previousMonth;
      })
      .reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

    const growth = lastMonthSales === 0 
      ? 100 
      : ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100;

    return NextResponse.json({
      salesData,
      orderData: orderData.slice(0, 10), // Last 10 orders
      stats: {
        totalRevenue,
        totalOrders: ordersSnapshot.size,
        totalCustomers: usersSnapshot.size,
        totalProducts: productsSnapshot.size,
        growth: growth.toFixed(1)
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}