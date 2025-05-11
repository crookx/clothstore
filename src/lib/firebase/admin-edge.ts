import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
};

export function getFirebaseAdminApp() {
  try {
    return getApps().length === 0 
      ? initializeApp(firebaseAdminConfig) 
      : getApp();
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw error;
  }
}

export const adminAuth = getAuth(getFirebaseAdminApp());