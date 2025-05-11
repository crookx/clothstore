import { cookies } from 'next/headers';
import { adminAuth } from './firebase/admin-edge';

export interface Session {
  uid: string;
  email: string;
  admin: boolean;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value);
    const user = await adminAuth.getUser(decodedClaims.uid);

    return {
      uid: user.uid,
      email: user.email || '',
      admin: user.customClaims?.admin === true
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}