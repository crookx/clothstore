
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Import other Firebase services as needed (e.g., getStorage)

// --- IMPORTANT ---
// The configuration values below are read from your environment variables.
// Ensure you have a .env.local file in the root of your project with these values,
// or configure them in your deployment environment.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// --- Environment Variable Validation ---
// Check if essential environment variables are defined.
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  // Log a more informative error in development/client-side, but avoid crashing server in production if possible initially
  const errorMessage =
    `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}. ` +
    `Please ensure they are set in your .env.local file or environment configuration.`;

  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
    console.error(errorMessage);
    // Optionally throw an error to halt execution in dev/client if preferred
    // throw new Error(errorMessage);
  } else {
     // In production server-side, log a warning but allow initialization to proceed.
     // Services might fail later if config is truly invalid.
     console.warn(errorMessage);
  }
}


// Initialize Firebase
// Check if Firebase has already been initialized to prevent errors
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    throw new Error(`Firebase initialization failed. Check your console for details. Ensure Firebase credentials in '.env.local' are correct. Original error: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  app = getApp();
}


// Export Firebase services
// Use try-catch blocks for better error isolation, especially if initialization might proceed with warnings
let auth;
let db;

try {
  auth = getAuth(app);
} catch (error) {
    console.error("Firebase Auth service initialization failed:", error);
    // Decide if you want to throw or just warn. Throwing might be safer.
    throw new Error(`Firebase Auth service initialization failed. Original error: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  db = getFirestore(app);
} catch (error) {
    console.error("Firestore service initialization failed:", error);
    throw new Error(`Firestore service initialization failed. Original error: ${error instanceof Error ? error.message : String(error)}`);
}

// Export other services like: const storage = getStorage(app);

export { app, auth, db };
