import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const sales = await db.order.findMany({
      where: {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to)
        },
        status: 'completed'
      },
      select: {
        createdAt: true,
        total: true
      }
    });

    // Group by date and sum totals
    const dailySales = sales.reduce((acc, sale) => {
      const date = sale.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + sale.total;
      return acc;
    }, {});

    const formattedData = Object.entries(dailySales).map(([date, amount]) => ({
      date,
      amount
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    );
  }
}