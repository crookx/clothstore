import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const getFirebaseConfig = () => {
  // Debug logging
  console.log('Initializing Firebase Admin with:', {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    hasCredentials: !!process.env.FIREBASE_CLIENT_EMAIL && !!process.env.FIREBASE_PRIVATE_KEY
  });

  if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('Missing Firebase Admin credentials');
  }

  return {
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  };
};

// Initialize Firebase Admin only once
let auth: ReturnType<typeof getAuth>;

if (!getApps().length) {
  const app = initializeApp(getFirebaseConfig());
  auth = getAuth(app);
}

export { auth };