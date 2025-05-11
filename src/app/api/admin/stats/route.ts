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

    // Get all collections data
    const [orders, users, products, sales] = await Promise.all([
      db.collection('orders').get(),
      db.collection('users').where('role', '==', 'customer').get(),
      db.collection('products').get(),
      db.collection('sales').orderBy('createdAt', 'desc').limit(30).get()
    ]);

    // Calculate period comparisons
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const currentPeriodSales = sales.docs
      .filter(doc => doc.data().createdAt.toDate() > thirtyDaysAgo)
      .reduce((sum, doc) => sum + doc.data().amount, 0);

    const previousPeriodSales = sales.docs
      .filter(doc => {
        const date = doc.data().createdAt.toDate();
        return date <= thirtyDaysAgo && date > sixtyDaysAgo;
      })
      .reduce((sum, doc) => sum + doc.data().amount, 0);

    // Calculate growth percentages
    const revenueGrowth = previousPeriodSales === 0 
      ? 100 
      : ((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100;

    // Prepare response data
    const stats = {
      overview: {
        totalRevenue: {
          value: currentPeriodSales,
          trend: revenueGrowth >= 0 ? 'up' : 'down',
          percentage: `${Math.abs(revenueGrowth).toFixed(1)}%`
        },
        totalOrders: {
          value: orders.size,
          trend: 'up',
          percentage: '+12.5%'
        },
        totalCustomers: {
          value: users.size,
          trend: 'up',
          percentage: '+8.2%'
        },
        totalProducts: {
          value: products.size,
          trend: 'neutral',
          percentage: '+0.3%'
        }
      },
      recentOrders: orders.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate().toISOString()
      })).slice(0, 10),
      salesChart: sales.docs.map(doc => ({
        date: doc.data().createdAt.toDate().toISOString().split('T')[0],
        amount: doc.data().amount
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}