import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin-config';

interface SessionClaims {
  uid: string;
  email: string;
  role?: string;
  admin?: boolean;
}

export async function verifySession(): Promise<SessionClaims> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    throw new Error('No session cookie found');
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email || '',
      role: decodedClaims.role,
      admin: decodedClaims.admin
    };
  } catch (error) {
    throw new Error('Invalid session');
  }
}