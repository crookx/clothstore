// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';

// --- Environment Variable Keys ---
// Define the keys we expect, WITH the NEXT_PUBLIC_ prefix
const firebaseEnvVarKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const; // Use const assertion for stricter typing

// --- Firebase Configuration Object ---
// Build the config object using the correct prefixed env vars
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
const missingEnvVars = firebaseEnvVarKeys.filter(key => {
    const value = process.env[key];
    // Check if the value is missing, empty, or still a placeholder
    return !value || value.startsWith('YOUR_') || value.includes('XXX') || value === "" || value === "YOUR_PROJECT_ID_HERE"; // Added check for specific placeholder
});

if (missingEnvVars.length > 0) {
    const simpleMissingKeys = missingEnvVars.map(key => key.replace('NEXT_PUBLIC_FIREBASE_', '')); // Show simpler names in error
    const errorMessage =
        `🔴 FATAL ERROR: Missing or placeholder Firebase environment variables: ${simpleMissingKeys.join(', ')}. ` +
        `\n\n➡️ Please take the following steps:\n` +
        `1. CHECK FILE LOCATION: Ensure a file named '.env.local' exists in the ROOT directory of your project (the same folder as package.json).\n` +
        `2. CHECK VARIABLES: Open '.env.local' and verify that ALL the required variables (like NEXT_PUBLIC_FIREBASE_API_KEY, etc.) are present and have your ACTUAL Firebase credential values (NOT placeholders like 'YOUR_...' or 'XXX' or empty values).\n` +
        `3. RESTART SERVER: After creating or modifying '.env.local', you MUST STOP your Next.js development server (Ctrl+C in the terminal) and RESTART it using 'npm run dev' or 'yarn dev'.\n`;

    firebaseInitializationError = new Error(errorMessage); // Store the error

    // Log detailed error message to the server console AND client console (if possible)
    console.error(errorMessage); // Server console
    if (typeof window !== 'undefined') {
         console.error(errorMessage); // Client console
    }
} else {
    // --- Initialize Firebase App (Only if no config errors) ---
    try {
        if (!getApps().length) {
            app = initializeApp(firebaseConfig);
            console.log("Firebase App initialized successfully.");
        } else {
            app = getApp();
            // console.log("Firebase app already initialized."); // Less verbose now
        }

        // --- Initialize Firebase Services (Only if App is initialized) ---
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        // console.log("Firebase Auth, Firestore, and Storage services obtained."); // Less verbose

        // --- Connect to Emulators (Optional - Development Only) ---
        const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
        if (useEmulator && typeof window !== 'undefined' && !(globalThis as any).__firebase_emulators_connected) {
            (globalThis as any).__firebase_emulators_connected = true;
            console.warn("🔌 Connecting to Firebase Emulators (client-side)...");
            try {
                connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
                connectFirestoreEmulator(db, "localhost", 8080);
                connectStorageEmulator(storage, "localhost", 9199);
                console.log("✅ Attempted connection to Auth, Firestore, and Storage Emulators.");
            } catch (emulatorError: any) {
                console.warn("Emulator connection issue (might be expected):", emulatorError.message);
            }
        }

    } catch (error: any) {
        console.error("🔴 Firebase initialization failed:", error);
        // Store the specific initialization error
        firebaseInitializationError = new Error(`Firebase initialization failed. Original error: ${error.message}`);
        console.error(firebaseInitializationError.message); // Log immediately
    }
}

// --- Function to Ensure Services are Ready ---
// This function acts as a gatekeeper. Code needing Firebase services should call this first.
// It returns the services if successful, or null if there was an initialization error.
export const ensureFirebaseServices = (): {
    app: ReturnType<typeof initializeApp>;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
} | null => {
    // If an error occurred during initialization (config or service level), return null.
    if (firebaseInitializationError) {
        // Error is already logged in the console during the check
        return null;
    }
    // Double-check if services are somehow undefined even without an error flag
    if (!app || !auth || !db || !storage) {
         // Set the error state now if it wasn't caught before
         firebaseInitializationError = new Error("Firebase services are unexpectedly unavailable after initialization attempt.");
         console.error(firebaseInitializationError.message);
         return null;
    }
    // Return the initialized services if everything is okay
    return { app, auth, db, storage };
};

// Export the error state itself for potential conditional rendering or logging elsewhere
// This allows components to check if initialization failed without calling ensureFirebaseServices
export { firebaseInitializationError };
