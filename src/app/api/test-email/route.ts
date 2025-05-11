import { NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email';
import type { Order } from '@/types/order';

export async function POST() {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 503 }
    );
  }

  try {
    const testOrder: Order = {
      id: 'test-123',
      userId: 'test-user-id',
      customerEmail: 'delivered@resend.dev', // Use Resend's testing email
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

    const result = await sendOrderConfirmation(testOrder);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error.message 
      },
      { status: 500 }
    );
  }
}