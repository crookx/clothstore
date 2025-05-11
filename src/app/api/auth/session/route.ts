import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin-edge';

const SESSION_EXPIRY_DAYS = 5;

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'Missing ID token' }, 
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check if user has admin claim
    const isAdmin = decodedToken.admin === true;

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * SESSION_EXPIRY_DAYS * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json(null);
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value);
    const user = await adminAuth.getUser(decodedClaims.uid);

    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      admin: user.customClaims?.admin === true
    });
  } catch (error) {
    console.error('Session verification failed:', error);
    return NextResponse.json(null);
  }
}