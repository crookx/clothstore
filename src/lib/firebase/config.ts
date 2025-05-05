// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// --- IMPORTANT ---
// The configuration values below are read from your environment variables.
// Ensure you have a .env.local file in the ROOT directory of your project (the same folder as package.json)
// with these values, AND that you have RESTARTED your Next.js server after creating/modifying the file.
/*
Example .env.local content:

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA4enA7am2MqIoZlSxy7kD8RtqOjmK8-Bs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=futurebabies.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=futurebabies
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=futurebabies.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=581042965774
NEXT_PUBLIC_FIREBASE_APP_ID=1:581042965774:web:c53f86be663498c7e4db5f
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX # Optional

*/

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// --- Environment Variable Validation ---
const requiredEnvVarKeys: (keyof FirebaseOptions)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingEnvVars = requiredEnvVarKeys.filter((key) => {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
    // Use the actual env var name for checking process.env
    const value = process.env[envVarName];
    // Check if the value is missing, empty, or still a placeholder
    return !value || value.startsWith('YOUR_') || value.includes('XXX'); // Add common placeholders
});

let app: ReturnType<typeof initializeApp> | undefined;
let auth: ReturnType<typeof getAuth> | undefined;
let db: ReturnType<typeof getFirestore> | undefined;
let storage: ReturnType<typeof getStorage> | undefined;
let firebaseInitializationError: Error | null = null;

if (missingEnvVars.length > 0) {
  const missingVarNames = missingEnvVars.map(key => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
  const errorMessage =
    `🔴 FATAL ERROR: Missing or placeholder Firebase environment variables: ${missingVarNames.join(', ')}. ` +
    `\n\n➡️ Please take the following steps:\n` +
    `1. CHECK FILE LOCATION: Ensure a file named '.env.local' exists in the ROOT directory of your project (the same folder as package.json).\n` +
    `2. CHECK VARIABLES: Open '.env.local' and verify that ALL the required variables listed above are present and have your ACTUAL Firebase credential values (NOT placeholders like 'YOUR_...' or 'XXX' or empty values).\n` +
    `3. RESTART SERVER: After creating or modifying '.env.local', you MUST STOP your Next.js development server (Ctrl+C in the terminal) and RESTART it using 'npm run dev' or 'yarn dev'.\n`;

    firebaseInitializationError = new Error("Firebase configuration error. Check console for details.");

    // Log detailed error message to the server console AND client console (if possible)
    console.error(errorMessage); // Server console
    if (typeof window !== 'undefined') {
         console.error(errorMessage); // Client console
    }

} else {
    // Initialize Firebase only if all required variables are present
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
      } catch (error: any) {
        console.error("Firebase initialization failed during initializeApp:", error);
        firebaseInitializationError = new Error(`Firebase initialization failed. Check your console for details. Original error: ${error.message}`);
      }
    } else {
      app = getApp();
      // console.log("Firebase app already initialized."); // Less verbose logging
    }

    // Initialize services only if app was initialized successfully
    if (app && !firebaseInitializationError) {
        try {
          auth = getAuth(app);
          db = getFirestore(app);
          storage = getStorage(app);

          const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
          if (useEmulator && typeof window !== 'undefined') { // Connect emulators only on the client-side during development
            console.log("Connecting to Firebase Emulators (client-side)...");
             // Check if already connected to avoid errors
             // Note: Emulator connection status check is tricky. Rely on conditional connection.
             try {
                connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
                connectFirestoreEmulator(db, "localhost", 8080);
                connectStorageEmulator(storage, "localhost", 9199);
                 console.log("Attempted connection to Auth, Firestore, and Storage Emulators.");
             } catch (emulatorError: any) {
                 // Gracefully handle errors if emulators are already connected or unavailable
                 if (emulatorError.code !== 'failed-precondition') {
                    console.warn("Emulator connection error (may be expected if already connected or emulators not running):", emulatorError.message);
                 }
             }
          }

        } catch (error: any) {
            console.error("Firebase service initialization failed (getAuth/getFirestore/getStorage):", error);
            firebaseInitializationError = new Error(`Firebase service initialization failed. Original error: ${error.message}`);
        }
    }
}

// Export Firebase services
// Using a function to ensure error is thrown if accessed when not initialized
export const ensureFirebaseServices = () => {
    if (firebaseInitializationError) {
      // Throw the captured error to prevent usage of uninitialized services
      throw firebaseInitializationError;
    }
    if (!app || !auth || !db || !storage) {
      // This case should ideally be covered by firebaseInitializationError, but as a fallback:
      throw new Error("Firebase services are not available. Initialization might have failed silently. Check server logs and environment variables.");
    }
    return { app, auth, db, storage };
};

// Direct exports are less safe if initialization fails, use ensureFirebaseServices instead
// export { app, auth, db, storage };
export { firebaseInitializationError }; // Export the error state if needed elsewhere
