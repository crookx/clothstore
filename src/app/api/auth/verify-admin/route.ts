import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin-config';

export const runtime = 'nodejs'; // Force Node.js runtime

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Decoded token:', decodedToken);

    return NextResponse.json({ 
      isAdmin: decodedToken.admin === true,
      uid: decodedToken.uid,
      email: decodedToken.email 
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET() {
  try {
    // Properly await the cookies
    const cookiesList = await cookies();
    const sessionCookie = cookiesList.get('session');

    if (!sessionCookie?.value) {
      console.log('[GET /auth/verify-admin] No session cookie found.');
      return NextResponse.json(
        { error: 'No session cookie found' },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true // Check if cookie is revoked
    );

    // Check admin claim
    if (!decodedClaims.admin) {
      return NextResponse.json(
        { error: 'Not authorized as admin' },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      admin: true,
      uid: decodedClaims.uid 
    });

  } catch (error) {
    console.error('Session verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    );
  }
}