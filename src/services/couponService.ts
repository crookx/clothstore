import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface Coupon {
  code: string;
  discountPercent: number;
  minPurchase?: number;
  expiresAt: string;
  productIds?: string[];
}

export async function validateCoupon(code: string, total: number, productIds: string[]) {
  const couponQuery = query(
    collection(db, 'coupons'),
    where('code', '==', code.toUpperCase())
  );

  const snapshot = await getDocs(couponQuery);
  if (snapshot.empty) {
    throw new Error('Invalid coupon code');
  }

  const coupon = snapshot.docs[0].data() as Coupon;
  const now = new Date();
  
  if (new Date(coupon.expiresAt) < now) {
    throw new Error('Coupon has expired');
  }

  if (coupon.minPurchase && total < coupon.minPurchase) {
    throw new Error(`Minimum purchase amount of $${coupon.minPurchase} required`);
  }

  if (coupon.productIds && !productIds.some(id => coupon.productIds?.includes(id))) {
    throw new Error('Coupon not applicable to these products');
  }

  return coupon;
}