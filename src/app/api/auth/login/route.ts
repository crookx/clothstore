import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin-config';
import { cookies } from 'next/headers';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const SESSION_EXPIRY_DAYS = 5;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    // First authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // Get user claims to check role
    const adminUser = await adminAuth.getUserByEmail(email);
    console.log('User found:', adminUser.uid);

    const { customClaims } = await adminAuth.getUser(adminUser.uid);
    console.log('User claims:', customClaims);

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    // Return appropriate redirect based on role
    const redirectPath = customClaims?.admin ? '/admin/dashboard' : '/dashboard';
    return NextResponse.json({ 
      success: true, 
      redirect: redirectPath,
      isAdmin: !!customClaims?.admin 
    });

  } catch (error) {
    console.error('Firebase auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}