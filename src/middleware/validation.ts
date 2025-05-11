import { z } from 'zod';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Product Schema
export const ProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  category: z.string(),
  stock: z.number().int().min(0),
});

export type Product = z.infer<typeof ProductSchema>;

// Order Schema
export const OrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
});

export type Order = z.infer<typeof OrderSchema>;

export async function validateRequest(
  request: NextRequest,
  schema: z.ZodSchema
) {
  try {
    const body = await request.json();
    await schema.parseAsync(body);
    return NextResponse.next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}