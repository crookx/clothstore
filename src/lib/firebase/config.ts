// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Import other Firebase services as needed (e.g., getStorage)

// --- IMPORTANT ---
// Replace the placeholder values below with your actual Firebase project configuration.
// You can find these details in your Firebase project settings:
// Project settings > General > Your apps > Web app > Firebase SDK snippet > Config
// It's recommended to store these values in environment variables for security.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
// Check if Firebase has already been initialized to prevent errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
// Export other services like: const storage = getStorage(app);

export { app, auth, db };
