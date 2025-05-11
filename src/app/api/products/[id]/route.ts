import { NextResponse } from 'next/server';
import { getFirebaseServices } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import type { Product } from '@/types/product';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const services = getFirebaseServices();
    if (!services) {
      return NextResponse.json(
        { error: 'Firebase services unavailable' },
        { status: 500 }
      );
    }

    const docRef = doc(services.db, 'products', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const productData = docSnap.data();
    const product: Product = {
      id: docSnap.id,
      ...productData
    } as Product;

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}