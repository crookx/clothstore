// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';

// --- Firebase Configuration Object ---
// Reads NEXT_PUBLIC_ prefixed variables, crucial for client-side access in Next.js
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


// --- Initialize Firebase App and Services ---
try {
    // Basic check if essential config values seem present (avoids cryptic Firebase errors if totally blank)
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
         throw new Error("Essential Firebase config (apiKey, projectId) is missing. Check .env.local and ensure variables start with NEXT_PUBLIC_");
    }

    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
        console.log("Firebase App initialized successfully.");
    } else {
        app = getApp();
        // console.log("Firebase app already initialized.");
    }

    // Get services only if app initialized successfully
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    // console.log("Firebase Auth, Firestore, and Storage services obtained.");

    // --- Connect to Emulators (Optional - Development Only) ---
    const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
     // Check if running in a browser context before connecting emulators
     if (useEmulator && typeof window !== 'undefined' && !(globalThis as any).__firebase_emulators_connected) {
        (globalThis as any).__firebase_emulators_connected = true; // Prevent multiple connections
        console.warn("🔌 Connecting to Firebase Emulators (client-side)...");
        try {
             // Make sure auth, db, storage are defined before connecting
             if (auth) connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true }); else console.warn("Auth service not available for emulator connection.");
             if (db) connectFirestoreEmulator(db, "localhost", 8080); else console.warn("Firestore service not available for emulator connection.");
             if (storage) connectStorageEmulator(storage, "localhost", 9199); else console.warn("Storage service not available for emulator connection.");
            console.log("✅ Attempted connection to Auth, Firestore, and Storage Emulators.");
        } catch (emulatorError: any) {
            console.warn("Emulator connection issue (might be expected if emulators aren't running):", emulatorError.message);
        }
    }

} catch (error: any) {
    console.error("🔴 Firebase initialization failed:", error);
    // Store the specific initialization error
    firebaseInitializationError = new Error(`Firebase initialization failed: ${error.message}. Ensure config in .env.local is correct and server restarted.`);
    console.error(firebaseInitializationError.message); // Log immediately
}


// --- Function to Ensure Services are Ready ---
// Returns the services if successful, or null if there was an initialization error.
export const ensureFirebaseServices = (): {
    app: ReturnType<typeof initializeApp>;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
} | null => {
    // If an error occurred during initialization, return null.
    if (firebaseInitializationError) {
        // The error was already logged during the catch block
        return null;
    }
    // Double-check if services are somehow undefined even without an error flag
    if (!app || !auth || !db || !storage) {
         firebaseInitializationError = new Error("Firebase services are unexpectedly unavailable after initialization attempt.");
         console.error(firebaseInitializationError.message);
         return null;
    }
    // Return the initialized services if everything is okay
    return { app, auth, db, storage };
};

// Export the error state itself for conditional rendering or logging elsewhere
export { firebaseInitializationError };
