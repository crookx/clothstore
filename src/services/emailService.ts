import { db } from '@/lib/firebase/config';
import { addDoc, collection } from 'firebase/firestore';
import { sendEmail } from '@/lib/email';

export interface EmailTemplate {
  type: 'order_confirmation' | 'shipping_update' | 'return_approved' | 'newsletter';
  to: string;
  subject: string;
  data: Record<string, any>;
  html?: string; // Added html as optional property
}

export async function sendNotification(template: EmailTemplate) {
  try {
    // Log email for tracking
    await addDoc(collection(db, 'emails'), {
      ...template,
      sentAt: new Date().toISOString(),
    });

    // Send email using your email provider
    await sendEmail(template);

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function subscribeToNewsletter(email: string) {
  try {
    // Add to subscribers collection
    await addDoc(collection(db, 'newsletter_subscribers'), {
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active'
    });

    // Send welcome email
    await sendNotification({
      type: 'newsletter',
      to: email,
      subject: 'Welcome to Our Newsletter!',
      data: {},
      html: `
        <h1>Welcome to Our Newsletter!</h1>
        <p>Thank you for subscribing to our newsletter. Stay tuned for updates!</p>
      `
    });

    return true;
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
}