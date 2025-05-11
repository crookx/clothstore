import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { adminAuth } from './firebase/admin-edge';

export interface SessionClaims {
  uid: string;
  email: string;
  admin: boolean; // Changed from isAdmin to admin to match Firebase claims
  // ...other claims
}

export async function getSession(request: NextRequest): Promise<SessionClaims | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    
    if (!session) {
      console.log('[getSession] No session cookie found');
      return null;
    }

    // Verify the session cookie first
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    console.log('[getSession] Session cookie verified for uid:', decodedClaims.uid);

    // Get fresh user data and claims
    const user = await adminAuth.getUser(decodedClaims.uid);
    
    if (!user) {
      console.error('[getSession] User not found in Firebase');
      return null;
    }

    // Explicitly check admin claim
    const isAdmin = user.customClaims?.admin === true;
    console.log('[getSession] User claims:', {
      uid: user.uid,
      email: user.email,
      isAdmin,
      rawClaims: user.customClaims
    });

    return {
      uid: user.uid,
      email: user.email || '',
      admin: isAdmin
    };
  } catch (error) {
    console.error('[getSession] Error:', error instanceof Error ? error.message : error);
    return null;
  }
}