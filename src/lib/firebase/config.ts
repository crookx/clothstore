
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Import other Firebase services as needed (e.g., getStorage)

// --- Environment Variable Validation ---
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}. ` +
    `Please ensure they are set in your .env.local file or environment configuration.`
  );
}

// --- IMPORTANT ---
// The configuration values below are read from your environment variables.
// Ensure you have a .env.local file in the root of your project with these values,
// or configure them in your deployment environment.
// Example .env.local:
// NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
// ...etc
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!, // Added non-null assertion after check
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
// Check if Firebase has already been initialized to prevent errors
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    // Re-throw a more specific error or handle initialization failure
    throw new Error(`Firebase initialization failed. Please check your configuration and environment variables. Original error: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  app = getApp();
}


// Export Firebase services
// Use try-catch blocks around service initialization for better error isolation, though the primary issue is likely config.
let auth;
let db;

try {
  auth = getAuth(app);
} catch (error) {
    console.error("Firebase Auth initialization failed:", error);
    throw new Error(`Firebase Auth initialization failed. This might be due to invalid configuration. Original error: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  db = getFirestore(app);
} catch (error) {
    console.error("Firestore initialization failed:", error);
    throw new Error(`Firestore initialization failed. Original error: ${error instanceof Error ? error.message : String(error)}`);
}

// Export other services like: const storage = getStorage(app);

export { app, auth, db };

