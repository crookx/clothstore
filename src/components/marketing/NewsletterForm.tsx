'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getFirebaseServices } from '@/lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const services = getFirebaseServices();
      if (!services) throw new Error('Firebase services not available');

      const subscribersRef = collection(services.db, 'newsletter_subscribers');
      await addDoc(subscribersRef, {
        email,
        subscribedAt: new Date(),
      });

      toast({
        title: 'Successfully subscribed!',
        description: 'You will now receive our newsletter updates.',
      });

      setEmail('');
    } catch (error) {
      toast({
        title: 'Subscription failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">Subscribe to Our Newsletter</h3>
      <p className="text-muted-foreground">Stay updated with our latest products and offers!</p>
      
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
    </form>
  );
}