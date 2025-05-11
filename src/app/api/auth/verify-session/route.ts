import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin-config';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { session } = await request.json();
    
    if (!session) {
      console.log('No session provided');
      return NextResponse.json(
        { isAdmin: false, error: 'No session provided' }, 
        { status: 401 }
      );
    }

    // Verify session
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    
    // Get fresh user data to ensure admin status
    const user = await adminAuth.getUser(decodedClaims.uid);
    
    // Check admin claim from custom claims
    const isAdmin = user.customClaims?.admin === true;
    console.log('Session verified for user:', {
      uid: user.uid,
      email: user.email,
      isAdmin,
      customClaims: user.customClaims
    });

    if (!isAdmin) {
      console.log('User is not an admin');
      return NextResponse.json(
        { isAdmin: false, error: 'Not authorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      isAdmin: true,
      user: {
        uid: user.uid,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Session verification failed:', error);
    return NextResponse.json(
      { isAdmin: false, error: 'Invalid session' },
      { status: 401 }
    );
  }
}