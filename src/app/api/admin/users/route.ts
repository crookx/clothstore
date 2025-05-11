import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin-config';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify admin session
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!decodedClaims.admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // List all users from Firebase Auth
    const { users: authUsers } = await adminAuth.listUsers();
    console.log('Found Firebase Auth users count:', authUsers.length);

    // Get Firestore data
    const db = getFirestore();
    const usersRef = db.collection('users');
    
    // Map users with their Firestore data
    const users = await Promise.all(authUsers.map(async (authUser) => {
      const userDoc = await usersRef.doc(authUser.uid).get();
      const userData = userDoc.data() || {};
      
      return {
        id: authUser.uid,
        email: authUser.email,
        name: userData.name || authUser.displayName,
        emailVerified: authUser.emailVerified,
        role: userData.role || 'customer',
        accountStatus: userData.accountStatus || 'active',
        createdAt: userData.createdAt?.toDate().toISOString() || authUser.metadata.creationTime,
        lastLogin: userData.lastLogin?.toDate()?.toISOString() || authUser.metadata.lastSignInTime,
        metadata: {
          ...userData.metadata,
          displayName: authUser.displayName
        }
      };
    }));

    console.log('Processed users count:', users.length);
    return NextResponse.json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' }, 
      { status: 500 }
    );
  }
}