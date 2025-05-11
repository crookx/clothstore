import * as z from 'zod';

export const emailSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
});

export type EmailSchema = z.infer<typeof emailSchema>;