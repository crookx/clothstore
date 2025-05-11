import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wsClient } from '@/lib/websocket';
import type { InventoryGroup, FormattedInventory } from '@/types/inventory';

export async function GET() {
  try {
    const inventory = await db.product.groupBy({
      by: ['category'],
      _sum: {
        stockQuantity: true
      },
      _min: {
        reorderPoint: true
      }
    });

    const formattedData: FormattedInventory[] = inventory.map((item: InventoryGroup) => ({
      category: item.category,
      stock: item._sum.stockQuantity,
      reorderPoint: item._min.reorderPoint
    }));

    // Notify connected clients about the update
    wsClient.broadcast('inventory-updates', formattedData);

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    );
  }
}