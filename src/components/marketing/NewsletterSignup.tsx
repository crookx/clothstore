'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { subscribeToNewsletter } from '@/services/emailService';
import { emailSchema, type EmailSchema } from '@/lib/validations';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

export function NewsletterSignup() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: EmailSchema) {
    setLoading(true);

    try {
      await subscribeToNewsletter(data.email);
      
      toast({
        title: 'Success!',
        description: 'Thank you for subscribing to our newsletter.',
      });
      
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to subscribe';
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      
      // Log error to monitoring service
      console.error('Newsletter subscription error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-semibold">Subscribe to Our Newsletter</h3>
        <p className="text-sm text-muted-foreground">
          Get updates on new products, sales, and more.
        </p>
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={loading || !form.formState.isValid}
            aria-label={loading ? 'Subscribing to newsletter' : 'Subscribe to newsletter'}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
      </form>
    </Form>
  );
}