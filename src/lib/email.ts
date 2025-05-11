import type { EmailTemplate } from '@/services/emailService';
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation';
import type { Order } from '@/types/order';

if (!process.env.RESEND_API_KEY) {
  console.error('Warning: RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'test');

/**
 * Sends an email based on the provided template.
 *
 * @param template - The email template containing recipient, subject, and data.
 * @returns A promise that resolves when the email is sent (or simulated).
 */
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'your@domain.com',
      to,
      subject,
      html,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export async function sendOrderConfirmation(order: Order) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's default sending domain
      to: order.customerEmail,
      subject: `Order Confirmation #${order.id}`,
      react: OrderConfirmationEmail({ order }),
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    throw error;
  }
}