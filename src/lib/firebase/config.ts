
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Import other Firebase services as needed (e.g., getStorage)

// --- IMPORTANT ---
// The configuration values below are read from your environment variables.
// Ensure you have a .env.local file in the root of your project with these values,
// or configure them in your deployment environment.
// Create a file named `.env.local` in the root of your project and add your keys:
/*
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID (Optional)
*/

const firebaseConfig = {
  // Provide placeholder values if environment variables are missing.
  // WARNING: Replace these placeholders with your actual Firebase credentials
  // in a `.env.local` file for the application to function correctly.
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'MISSING_API_KEY',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING_AUTH_DOMAIN',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING_PROJECT_ID',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'MISSING_STORAGE_BUCKET',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'MISSING_MESSAGING_SENDER_ID',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'MISSING_APP_ID',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional, leave as undefined if missing
};

// --- Validation (Optional but Recommended) ---
// Log a warning if placeholder values are being used during runtime (client or server).
// This check helps diagnose configuration issues without crashing the app immediately.
if (
    typeof window !== 'undefined' || // Check if running on the client
    process.env.NODE_ENV !== 'production' // Check if running in development server-side
   ) {
    const requiredKeys: (keyof typeof firebaseConfig)[] = [
        'apiKey',
        'authDomain',
        'projectId',
        'storageBucket',
        'messagingSenderId',
        'appId',
    ];
    const usingPlaceholders = requiredKeys.some(
        (key) => firebaseConfig[key]?.startsWith('MISSING_')
    );

    if (usingPlaceholders) {
        console.warn(
          'WARNING: Firebase configuration is using placeholder values. ' +
          'The application requires actual Firebase credentials provided via environment variables ' +
          '(e.g., in a .env.local file) to function correctly. ' +
          'See src/lib/firebase/config.ts for required variables.'
        );
    }
}


// Initialize Firebase
// Check if Firebase has already been initialized to prevent errors
let app;
if (!getApps().length) {
  try {
    // Attempt initialization even with placeholder values.
    // Firebase SDK might throw errors later when services requiring valid credentials are used.
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    // Provide a more specific error message
    throw new Error(`Firebase initialization failed. Check your console for details. Ensure Firebase credentials in '.env.local' are correct if provided, or that placeholder values are structurally valid if not. Original error: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  app = getApp();
}


// Export Firebase services
// Use try-catch blocks around service initialization for better error isolation.
let auth;
let db;

try {
  // Use getAuth() which doesn't necessarily require immediate validation of API key during initialization.
  // Errors might occur later when auth methods are actually called if the config is invalid.
  auth = getAuth(app);
} catch (error) {
    console.error("Firebase Auth service initialization failed:", error);
    // Only throw if it's not an invalid API key error when using placeholders,
    // as that specific error is expected until configured.
    const isInvalidApiKeyError = error instanceof Error && error.message.includes('invalid-api-key');
    const isMissingApiKey = firebaseConfig.apiKey === 'MISSING_API_KEY';
    if (!(isInvalidApiKeyError && isMissingApiKey)) {
        throw new Error(`Firebase Auth service initialization failed. Original error: ${error instanceof Error ? error.message : String(error)}`);
    } else {
         console.warn("Firebase Auth initialization skipped due to missing API key. Authentication features will not work until configured.");
    }
}

try {
  db = getFirestore(app);
} catch (error) {
    console.error("Firestore service initialization failed:", error);
    throw new Error(`Firestore service initialization failed. Original error: ${error instanceof Error ? error.message : String(error)}`);
}

// Export other services like: const storage = getStorage(app);

export { app, auth, db };
