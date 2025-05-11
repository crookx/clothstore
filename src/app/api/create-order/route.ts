import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import Stripe from 'stripe';
import { CartItem } from '@/types/cart';
import { Address } from '@/types/profile';

interface OrderData {
  items: CartItem[];
  shippingAddress: Address;
  total: number;
  userId?: string;
}

export interface Order extends OrderData {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { items, shippingAddress, total, userId }: OrderData = await request.json();

    // Create order in Firestore
    const orderRef = await addDoc(collection(db, 'orders'), {
      items,
      shippingAddress,
      total,
      userId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: {
        orderId: orderRef.id,
      },
    });

    return NextResponse.json({
      orderId: orderRef.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}