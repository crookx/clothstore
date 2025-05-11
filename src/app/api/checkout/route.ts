import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createOrder } from '@/services/orderService';
import { adminAuth } from '@/lib/firebase-admin';
import type { OrderItem } from '@/types/order';

interface CheckoutItem extends OrderItem {
  image?: string;
}

interface CheckoutData {
  items: CheckoutItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  userId: string;
}

export async function POST(request: Request) {
  try {
    const { items, shippingAddress, userId }: CheckoutData = await request.json();

    // Verify user
    const userRecord = await adminAuth.getUser(userId);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: CheckoutItem) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        userId,
        orderData: JSON.stringify({
          items,
          shippingAddress,
          customerEmail: userRecord.email,
        }),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    );
  }
}