
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage';

// --- Define the shape of the services object ---
interface FirebaseServices {
    app: ReturnType<typeof initializeApp>;
    auth: Auth;
    db: Firestore;
    storage: FirebaseStorage;
}

// --- State variables ---
let firebaseServices: FirebaseServices | null = null;
let firebaseInitializationError: Error | null = null;

// --- Function to initialize Firebase (runs only once) ---
function initializeFirebase(): void {
    // Prevent re-initialization
    if (firebaseServices || firebaseInitializationError) {
        return;
    }

    // --- Firebase Configuration Object ---
    const firebaseConfig: FirebaseOptions = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
    };

    // --- Validate Environment Variables ---
    const requiredEnvVars: (keyof FirebaseOptions)[] = [
        'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
    ];
    const missingEnvVars = requiredEnvVars.filter(key => !firebaseConfig[key] || firebaseConfig[key] === 'YOUR_' + key.toUpperCase()); // Check for placeholders too

    if (missingEnvVars.length > 0) {
        const errorMessage = `🔴 FATAL ERROR: Missing or placeholder Firebase environment variables: ${missingEnvVars.join(', ')}.

➡️ Please take the following steps:
1. CHECK FILE LOCATION: Ensure a file named '.env.local' exists in the ROOT directory of your project (the same folder as package.json).
2. CHECK VARIABLES: Open '.env.local' and verify that ALL the required variables (like NEXT_PUBLIC_FIREBASE_API_KEY, etc.) are present and have your ACTUAL Firebase credential values (NOT placeholders like 'YOUR_...' or 'XXX' or empty values).
3. RESTART SERVER: After creating or modifying '.env.local', you MUST STOP your Next.js development server (Ctrl+C in the terminal) and RESTART it using 'npm run dev' or 'yarn dev'.
`;
        firebaseInitializationError = new Error(errorMessage);
        console.error(errorMessage); // Log error immediately
        // Don't throw here to allow graceful degradation where possible
        return; // Stop initialization
    }

    try {
        let app: ReturnType<typeof initializeApp>;
        if (!getApps().length) {
            app = initializeApp(firebaseConfig);
            console.log("Firebase App initialized successfully.");
        } else {
            app = getApp();
            // console.log("Firebase app already initialized.");
        }

        const auth = getAuth(app);
        const db = getFirestore(app);
        const storage = getStorage(app);
        // console.log("Firebase Auth, Firestore, and Storage services obtained.");

        firebaseServices = { app, auth, db, storage };

        // --- Connect to Emulators (Optional - Development Only) ---
        const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
        // Check if running in a browser context before connecting emulators
        if (useEmulator && typeof window !== 'undefined' && !(globalThis as any).__firebase_emulators_connected) {
            (globalThis as any).__firebase_emulators_connected = true; // Prevent multiple connections
            console.warn("🔌 Connecting to Firebase Emulators (client-side)...");
            try {
                connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
                connectFirestoreEmulator(db, "localhost", 8080);
                connectStorageEmulator(storage, "localhost", 9199);
                console.log("✅ Attempted connection to Auth, Firestore, and Storage Emulators.");
            } catch (emulatorError: any) {
                // Log emulator connection issues as warnings, not fatal errors
                 console.warn("Emulator connection issue (might be expected if emulators aren't running):", emulatorError.message);
                 // Don't set firebaseInitializationError for emulator connection issues
            }
        }

    } catch (error: any) {
        const initError = new Error(`🔴 Firebase initialization failed: ${error.message}. Check configuration and network access.`);
        firebaseInitializationError = initError;
        console.error(initError.message, error); // Log the specific error
    }
}

// --- Run initialization on module load ---
initializeFirebase();

// --- Function to Get Services ---
// This is the primary way other modules should access Firebase services.
// It ensures initialization has been attempted and returns null if failed.
export const getFirebaseServices = (): FirebaseServices | null => {
    // If initialization failed, return null. The error is already logged.
    if (firebaseInitializationError) {
        return null;
    }
     // If services are somehow still null after successful init attempt (shouldn't happen but safety check)
     if (!firebaseServices) {
         firebaseInitializationError = new Error("Firebase services requested before initialization was complete or it failed silently.");
         console.error(firebaseInitializationError.message);
         return null;
     }
    return firebaseServices;
};

// Export the error state itself if needed for specific UI handling
export { firebaseInitializationError };
