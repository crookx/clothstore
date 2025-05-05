// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';

// --- Firebase Configuration ---
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// --- Initialization Variables ---
let app: ReturnType<typeof initializeApp> | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let firebaseInitializationError: Error | null = null; // Store initialization error

// --- Check for Missing Environment Variables ---
const requiredEnvVarKeys: Array<keyof FirebaseOptions> = [
    'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
];

const missingEnvVars = requiredEnvVarKeys.filter(key => {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
    const value = process.env[envVarName];
    // Check if the value is missing, empty, or still a placeholder
    return !value || value.startsWith('YOUR_') || value.includes('XXX') || value === "";
});

if (missingEnvVars.length > 0) {
    const simpleMissingKeys = missingEnvVars.map(key => key.toString()); // Get simple key names
    const errorMessage =
        `🔴 FATAL ERROR: Missing or placeholder Firebase environment variables: ${simpleMissingKeys.join(', ')}. ` +
        `\n\n➡️ Please take the following steps:\n` +
        `1. CHECK FILE LOCATION: Ensure a file named '.env.local' exists in the ROOT directory of your project (the same folder as package.json).\n` +
        `2. CHECK VARIABLES: Open '.env.local' and verify that ALL the required variables (like NEXT_PUBLIC_FIREBASE_API_KEY, etc.) are present and have your ACTUAL Firebase credential values (NOT placeholders like 'YOUR_...' or 'XXX' or empty values).\n` +
        `3. RESTART SERVER: After creating or modifying '.env.local', you MUST STOP your Next.js development server (Ctrl+C in the terminal) and RESTART it using 'npm run dev' or 'yarn dev'.\n`;

    firebaseInitializationError = new Error(errorMessage); // Store the error

    // Log the error but don't throw immediately, especially on client
    console.error(errorMessage);
    if (typeof window !== 'undefined') {
         console.error(errorMessage); // Client console
     }


} else {
    // --- Initialize Firebase App (if no config errors) ---
    if (!getApps().length) {
        try {
            app = initializeApp(firebaseConfig);
            console.log("Firebase App initialized successfully.");
        } catch (error: any) {
            console.error("🔴 Firebase initialization failed during initializeApp:", error);
            firebaseInitializationError = new Error(`Firebase App initialization failed. Original error: ${error.message}`);
        }
    } else {
        app = getApp();
        // console.log("Firebase app already initialized."); // Less verbose
    }

    // --- Initialize Firebase Services (if App is initialized) ---
    if (app && !firebaseInitializationError) {
        try {
            auth = getAuth(app);
            db = getFirestore(app);
            storage = getStorage(app);
            console.log("Firebase Auth, Firestore, and Storage services obtained.");

            // --- Connect to Emulators (Optional - Development Only) ---
            const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
            // Connect emulators only on the client-side during development
            // Ensure this check runs only once or is idempotent
            if (useEmulator && typeof window !== 'undefined' && !(globalThis as any).__firebase_emulators_connected) {
                 (globalThis as any).__firebase_emulators_connected = true; // Simple flag to prevent reconnect attempts
                 console.warn("🔌 Connecting to Firebase Emulators (client-side)...");
                 try {
                     connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
                     connectFirestoreEmulator(db, "localhost", 8080);
                     connectStorageEmulator(storage, "localhost", 9199);
                     console.log("✅ Attempted connection to Auth, Firestore, and Storage Emulators.");
                 } catch (emulatorError: any) {
                     // More specific checks for common emulator connection issues
                     if (emulatorError.code === 'failed-precondition' || emulatorError.message.includes('already connected')) {
                         // console.log("Emulators likely already connected."); // Less verbose
                     } else if (emulatorError.message.includes('Firestore is not available')) {
                          console.warn("Firestore emulator might not be running or accessible at localhost:8080.");
                     } else {
                          console.warn("Emulator connection error (maybe expected if already connected or emulators not running):", emulatorError.message);
                     }
                 }
            }

        } catch (error: any) {
            console.error("🔴 Firebase service initialization failed (getAuth/getFirestore/getStorage):", error);
            // Store the error if services fail to initialize
            firebaseInitializationError = new Error(`Firebase service initialization failed. Original error: ${error.message}`);
        }
    } else if (!firebaseInitializationError) {
         // This case means config was okay, but getApp() or initializeApp() failed silently before
         firebaseInitializationError = new Error("Firebase App could not be initialized, but environment variables seemed correct. Check console logs.");
         console.error(firebaseInitializationError.message);
    }
}

// --- Function to Ensure Services are Ready ---
// This function acts as a gatekeeper. Code needing Firebase services should call this first.
export const ensureFirebaseServices = () => {
    // If an error occurred during initialization (config or service level), throw it now.
    if (firebaseInitializationError) {
        // Throw the actual error object that was stored
        throw firebaseInitializationError;
    }
    // Double-check if services are somehow undefined even without an error flag
    if (!app || !auth || !db || !storage) {
         // Set the error state now if it wasn't caught before
         firebaseInitializationError = new Error("Firebase services are unexpectedly unavailable. Initialization might have failed silently.");
         console.error(firebaseInitializationError.message);
         throw firebaseInitializationError;
    }
    // Return the initialized services if everything is okay
    return { app, auth, db, storage };
};

// Export the error state itself for potential conditional rendering or logging elsewhere
export { firebaseInitializationError };
