import { Resend } from 'resend';
import { OrderConfirmationEmail } from './templates/order-confirmation';
import { OrderStatusUpdateEmail } from './templates/order-status-update';
import type { Order } from '@/types/order';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: Order) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'orders@futurebabies.com',
      to: order.customerEmail,
      subject: `Order Confirmation #${order.id}`,
      react: OrderConfirmationEmail({ order }),
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    throw error;
  }
}

export async function sendOrderStatusUpdate(order: Order) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'orders@futurebabies.com',
      to: order.customerEmail,
      subject: `Order Status Update #${order.id}`,
      react: OrderStatusUpdateEmail({ order }),
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to send status update:', error);
    throw error;
  }
}