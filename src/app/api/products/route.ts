import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { rateLimiter } from '@/middleware/rateLimit';
import { csrfMiddleware } from '@/middleware/csrf';
import { validateRequest, ProductSchema } from '@/middleware/validation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');

    const db = getFirestore();
    let query: FirebaseFirestore.Query = db.collection('products');

    // Apply filters
    if (featured) {
      query = query.where('featured', '==', true);
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(products);

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply middlewares
  const rateLimit = await rateLimiter(request);
  if (rateLimit.status === 429) return rateLimit;

  const csrf = await csrfMiddleware(request);
  if (csrf.status === 403) return csrf;

  const validation = await validateRequest(request, ProductSchema);
  if (validation.status === 400) return validation;

  // Handle the request
  try {
    // ...existing code...
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}