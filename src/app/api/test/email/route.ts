import { NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email';
import type { Order, OrderStatus } from '@/types/order';

export async function POST(request: Request) {
  try {
    const { type, email } = await request.json();

    const testOrder: Order = {
      id: 'test-123',
      userId: 'test-user-id',
      customerEmail: email,
      items: [
        {
          id: 'item-1',
          productId: 'prod-1',
          name: 'Test Product',
          price: 99.99,
          quantity: 1,
          image: '/test-product.jpg'
        }
      ],
      total: 99.99,
      status: 'pending',
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let result;
    switch (type) {
      case 'order_confirmation':
        result = await sendOrderConfirmation(testOrder);
        break;
      default:
        throw new Error('Unknown email type');
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}