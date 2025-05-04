
/**
 * Firestore Seeding Script
 *
 * How to run:
 * 1.  Ensure you have a `.env.local` file in your project root with your
 *     Firebase configuration variables (e.g., NEXT_PUBLIC_FIREBASE_PROJECT_ID).
 * 2.  Get Service Account Credentials:
 *     - Go to your Firebase Project Settings > Service accounts.
 *     - Click "Generate new private key" and download the JSON file.
 *     - **IMPORTANT:** Rename this file (e.g., `serviceAccountKey.json`) and place it in a secure location *outside* your project's source control (add it to `.gitignore`). **NEVER COMMIT THIS FILE.**
 *     - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the *full path* of this downloaded JSON file.
 *       - On Linux/macOS: `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"`
 *       - On Windows (PowerShell): `$env:GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"`
 *       - (You might need to set this variable each time you open a new terminal, or add it to your shell's profile script like .bashrc or .zshrc)
 * 3.  Install Dependencies:
 *     - Run `npm install` or `yarn install` in your project root if you haven't already (to install `firebase-admin`, `tsx`, and `dotenv`).
 * 4.  Run the Script:
 *     - Execute the script from your project root using: `npm run seed:firestore` or `yarn seed:firestore`
 *
 * This script will:
 * - Connect to your Firestore database using Admin privileges.
 * - Clear the existing 'products' collection (optional, uncomment if needed).
 * - Add sample product data using batch writes.
 */
import dotenv from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';
import type { Product } from '@/types/product'; // Adjust path if necessary

// --- Load Environment Variables ---
// Load variables from .env.local located in the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });


// --- Configuration ---
// You MUST set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// to the path of your downloaded service account key JSON file.
// Example: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID; // Get Project ID from env
const COLLECTION_NAME = 'products';
const BATCH_SIZE = 100; // Firestore batch write limit is 500 operations

if (!PROJECT_ID) {
    console.error("Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable not set or not loaded from .env.local.");
    console.error("Ensure your .env.local file exists in the project root and contains the variable.");
    process.exit(1);
}

// --- Initialize Firebase Admin SDK ---
try {
    // Check if GOOGLE_APPLICATION_CREDENTIALS is set
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn("Warning: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
        console.warn("Attempting to initialize Firebase Admin SDK with default credentials.");
        // If you're running this in a Google Cloud environment (like Cloud Functions, App Engine),
        // it might still work without the variable set explicitly.
        // For local development, you MUST set GOOGLE_APPLICATION_CREDENTIALS.
         admin.initializeApp({
            projectId: PROJECT_ID,
         });

    } else {
        // Recommended: Initialize with explicit credentials from the environment variable
        admin.initializeApp({
            // Credential is automatically found from GOOGLE_APPLICATION_CREDENTIALS env var
            projectId: PROJECT_ID,
         });
    }


} catch (error: any) {
    if (error.code === 'app/duplicate-app') {
        console.log('Firebase Admin SDK already initialized.');
    } else {
        console.error('Firebase Admin SDK initialization error:', error);
        process.exit(1);
    }
}

const db = admin.firestore();

// --- Sample Product Data (Expand this!) ---
// Note: Generating 50 unique items per category is extensive.
// This provides a smaller sample structure. You can add more items following the pattern.
// Prices are in KES (Kenyan Shillings).
const sampleProducts: Omit<Product, 'id'>[] = [
    // == Strollers ==
    { name: "Cosmic Cruiser Stroller", description: "Smooth ride across any terrain, folds compactly.", price: 18500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller1/400/300", stock: 15 },
    { name: "Galaxy Glide Lightweight Stroller", description: "Perfect for travel, easy to maneuver.", price: 12000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller2/400/300", stock: 25 },
    { name: "Nebula Navigator Jogging Stroller", description: "For active parents, all-terrain wheels.", price: 25000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller3/400/300", stock: 8 },
    { name: "Astra Twin Stroller", description: "Side-by-side comfort for two little stars.", price: 32000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller4/400/300", stock: 5 },

    // == Car Seats ==
    { name: "StarHopper Infant Car Seat", description: "Rear-facing safety for newborns.", price: 9500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat1/400/300", stock: 30 },
    { name: "Orbit Shield Convertible Car Seat", description: "Grows with your child, forward & rear-facing.", price: 15500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat2/400/300", stock: 18 },
    { name: "Comet Booster Seat", description: "High-back booster for older kids.", price: 7000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat3/400/300", stock: 22 },

    // == Cribs ==
    { name: "Lunar Landing Crib", description: "Modern design, converts to toddler bed.", price: 28000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib1/400/300", stock: 12 },
    { name: "Dream Weaver Mini Crib", description: "Space-saving design for smaller nurseries.", price: 19000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib2/400/300", stock: 10 },
    { name: "Starlight Portable Crib", description: "Easy to set up for travel or visits.", price: 11500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib3/400/300", stock: 15 },

    // == Baby Monitors ==
    { name: "Guardian Angel Video Monitor", description: "HD video and two-way audio.", price: 13000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor1/400/300", stock: 40 },
    { name: "Echo Base Audio Monitor", description: "Clear sound, long range.", price: 4500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor2/400/300", stock: 50 },
    { name: "Smart Sight Monitor with App", description: "Connects to your phone, tracks vitals.", price: 22000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor3/400/300", stock: 10 },

    // == Feeding ==
    { name: "Rocket High Chair", description: "Adjustable height, easy to clean.", price: 8500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding1/400/300", stock: 28 },
    { name: "Galaxy Bottle Warmer", description: "Warms milk quickly and evenly.", price: 3500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding2/400/300", stock: 35 },
    { name: "Space Spoons (Set of 5)", description: "Soft-tip spoons for first solids.", price: 800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding3/400/300", stock: 100 },
    { name: "Nebula Bib Set (3 pack)", description: "Waterproof and easy wipe.", price: 1200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding4/400/300", stock: 80 },

     // == Clothing ==
    { name: "Star Explorer Onesie (3-pack)", description: "Soft cotton, size 0-3 months.", price: 2500, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing1/400/300", stock: 60 },
    { name: "Moon Walker Pajamas (Size 1T)", description: "Cozy fleece for chilly nights.", price: 1800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing2/400/300", stock: 45 },
    { name: "Little Dipper Sun Hat", description: "UPF 50+ protection.", price: 950, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing3/400/300", stock: 70 },

     // == Toys ==
    { name: "Planet Plushie Rattle", description: "Soft textures and gentle rattle sound.", price: 750, category: "Toys", imageUrl: "https://picsum.photos/seed/toy1/400/300", stock: 90 },
    { name: "Cosmic Activity Gym", description: "Engaging mat with hanging toys.", price: 6500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy2/400/300", stock: 20 },
    { name: "Building Blocks Universe Set", description: "Wooden blocks for creative play.", price: 3200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy3/400/300", stock: 30 },

    // Add many more products for each category... (Aim for ~50 total initially if 50 per category is too much to start)
];

// --- Function to clear existing collection (Use with caution!) ---
async function clearCollection(collectionPath: string) {
    console.log(`Clearing collection: ${collectionPath}...`);
    const collectionRef = db.collection(collectionPath);

    // Need to fetch next batch correctly after commit
      let snapshot;
      do {
        snapshot = await collectionRef.limit(BATCH_SIZE).get();
        if (snapshot.size === 0) {
          break; // Exit loop if no documents left
        }
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`Deleted ${snapshot.size} documents...`);
      } while (snapshot.size > 0);

    console.log(`Collection ${collectionPath} cleared.`);
}

// --- Function to add data in batches ---
async function seedData() {
    console.log('Starting Firestore seeding...');

    // **Optional: Uncomment to clear existing data before seeding**
    // await clearCollection(COLLECTION_NAME);
    // console.log("Waiting 5 seconds after clearing before seeding...");
    // await new Promise(resolve => setTimeout(resolve, 5000));


    const collectionRef = db.collection(COLLECTION_NAME);
    let batch = db.batch();
    let count = 0;

    for (const productData of sampleProducts) {
        const docRef = collectionRef.doc(); // Let Firestore generate the ID
        batch.set(docRef, productData);
        count++;

        if (count % BATCH_SIZE === 0) {
            console.log(`Committing batch ${Math.ceil(count / BATCH_SIZE)}...`);
            await batch.commit();
            batch = db.batch(); // Start a new batch
        }
    }

    // Commit any remaining items in the last batch
    if (count % BATCH_SIZE !== 0) {
        console.log('Committing final batch...');
        await batch.commit();
    }

    console.log(`Seeding complete. Added ${count} products to '${COLLECTION_NAME}'.`);
}

// --- Run the Seeding Process ---
seedData().catch((error) => {
    console.error('Error during Firestore seeding:', error);
    process.exit(1);
});

    