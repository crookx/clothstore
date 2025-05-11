import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createOrder } from '@/services/orderService';
import { headers } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get('stripe-signature')!;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (!session.metadata) {
        throw new Error('No metadata found in session');
      }
      const orderData = JSON.parse(session.metadata.orderData);

      await createOrder({
        userId: session.metadata.userId,
        customerEmail: orderData.customerEmail,
        items: orderData.items,
        total: session.amount_total! / 100,
        status: 'pending',
        shippingAddress: orderData.shippingAddress,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}