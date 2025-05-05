
/**
 * Firestore Seeding Script
 *
 * How to run:
 * 1.  Ensure you have a `.env.local` file in your project root with your
 *     Firebase configuration variables (e.g., NEXT_PUBLIC_FIREBASE_PROJECT_ID).
 * 2.  Get Service Account Credentials:
 *     - Go to your Firebase Project Settings > Service accounts.
 *     - Click "Generate new private key" and download the JSON file (e.g., `serviceAccountKey.json`).
 * 3.  **Upload the Service Account Key:** Upload the downloaded JSON key file (e.g., `serviceAccountKey.json`) into your Firebase Studio IDX workspace. You can place it in the root directory or another location.
 * 4.  **Set Environment Variable in `.env.local`:**
 *     - Open or create the `.env.local` file in your project root.
 *     - Add the following line, **replacing `/path/inside/idx/to/your/serviceAccountKey.json` with the ACTUAL path to the file you uploaded in step 3 within your IDX workspace**:
 *       ```
 *       GOOGLE_APPLICATION_CREDENTIALS=/path/inside/idx/to/your/serviceAccountKey.json
 *       ```
 *       *Example if uploaded to root:* `GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json`
 *       *Example if uploaded to `/secure` folder:* `GOOGLE_APPLICATION_CREDENTIALS=./secure/serviceAccountKey.json`
 *     - **NEVER commit the `.env.local` file or the service account key file to version control (Git).** Add `.env.local` and the key file name to your `.gitignore`.
 * 5.  Install Dependencies:
 *     - Run `npm install` or `yarn install` in your project root if you haven't already.
 * 6.  Run the Script:
 *     - Open your terminal *within the IDX environment* in the project root.
 *     - Execute the script using: `npm run seed:firestore`
 *     - The `dotenv-cli` tool (configured in `package.json`) will load the `GOOGLE_APPLICATION_CREDENTIALS` path from `.env.local` for the script execution.
 *
 * This script will:
 * - Connect to your Firestore database using Admin privileges derived from the service account key specified by GOOGLE_APPLICATION_CREDENTIALS.
 * - Add sample product data using batch writes.
 * - **By default, it DOES NOT clear existing data.** Uncomment the `clearCollection` line if you want to wipe the collection first.
 */
import path from 'path';
import admin from 'firebase-admin';
import type { Product } from '@/types/product'; // Adjust path if necessary


// --- Configuration ---
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID; // Get Project ID from env
const COLLECTION_NAME = 'products';
const BATCH_SIZE = 100; // Firestore batch write limit is 500 operations

// --- Environment Variable Validation ---
if (!PROJECT_ID || PROJECT_ID === "YOUR_PROJECT_ID_HERE") {
  const errorMessage =
    `\n❌ Configuration Error:\n` +
    ` Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable not set or still has the placeholder value.`+
    ` Please ensure it is set correctly in your .env.local file and you have replaced "YOUR_PROJECT_ID_HERE" with your actual Firebase Project ID.`+
    ` Remember to restart your terminal or source your profile if you set it globally.\n`;
  console.error(errorMessage);
  process.exit(1); // Exit if the crucial Project ID is missing or is the placeholder
}

// Validate GOOGLE_APPLICATION_CREDENTIALS presence (dotenv-cli should load this from .env.local)
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("\n❌ Configuration Error:");
    console.error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    console.error("Ensure it's defined in your .env.local file and points to the correct path");
    console.error("of your uploaded service account key JSON file within the IDX workspace.");
    console.error("Example line in .env.local: GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json");
    console.error("The `npm run seed:firestore` command uses `dotenv-cli` to load this.\n");
    process.exit(1);
}


// --- Initialize Firebase Admin SDK ---
try {
    // Check if already initialized to avoid duplicate app error
    if (admin.apps.length === 0) {
        // Use application default credentials (reads GOOGLE_APPLICATION_CREDENTIALS loaded by dotenv-cli)
        admin.initializeApp({
            // The credential is automatically read from the environment variable
            // GOOGLE_APPLICATION_CREDENTIALS when using applicationDefault()
            credential: admin.credential.applicationDefault(),
            projectId: PROJECT_ID, // Use the validated PROJECT_ID
         });
         console.log(`🔑 Firebase Admin SDK initialized for project: ${PROJECT_ID} using Application Default Credentials.`);
         // Note: We log a generic message as the specific path is now abstracted
         console.log(`   (Credentials loaded based on GOOGLE_APPLICATION_CREDENTIALS)`);
    } else {
        console.log('ℹ️ Firebase Admin SDK already initialized.');
    }
} catch (error: any) {
    console.error('❌ Firebase Admin SDK initialization error:', error);
    console.error(`   Ensure the GOOGLE_APPLICATION_CREDENTIALS path in your .env.local file ('${process.env.GOOGLE_APPLICATION_CREDENTIALS}') points to a valid service account key file within your IDX workspace.`);
    process.exit(1);
}

const db = admin.firestore();

// --- Sample Product Data (Kenyan Shillings - KES) ---
// Using KES (Kenyan Shillings) for prices
const sampleProducts: Omit<Product, 'id'>[] = [
    // == Strollers (Target: 50) ==
    { name: "Safari Cruiser Stroller", description: "Smooth ride across Nairobi streets, folds compactly.", price: 18500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller1/400/300", stock: 15 },
    { name: "Maasai Mara Lightweight Stroller", description: "Perfect for travel, easy to maneuver.", price: 12000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller2/400/300", stock: 25 },
    { name: "Kilimanjaro Jogging Stroller", description: "For active parents, all-terrain wheels.", price: 25000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller3/400/300", stock: 8 },
    { name: "Twiga Twin Stroller", description: "Side-by-side comfort for two little ones.", price: 32000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller4/400/300", stock: 5 },
    { name: "Jambo Travel System", description: "Includes stroller and infant car seat.", price: 29500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller5/400/300", stock: 10 },
    { name: "Mombasa Compact Fold Stroller", description: "Ultra-compact fold for easy storage.", price: 14000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller6/400/300", stock: 20 },
    { name: "Nakuru All-Weather Stroller", description: "Includes rain cover and footmuff.", price: 21000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller7/400/300", stock: 12 },
    { name: "Rafiki Reversible Seat Stroller", description: "Parent-facing or world-facing options.", price: 19800, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller8/400/300", stock: 18 },
    { name: "Duka City Mini Stroller", description: "Lightweight and agile for urban environments.", price: 16500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller9/400/300", stock: 22 },
    { name: "Simba Luxury Stroller", description: "Premium materials and enhanced suspension.", price: 35000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller10/400/300", stock: 7 },
    { name: "Karibu Basic Stroller", description: "Affordable and reliable everyday stroller.", price: 9500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller11/400/300", stock: 30 },
    { name: "Pacha Tandem Stroller", description: "Inline seating for two children.", price: 34000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller12/400/300", stock: 4 },
    { name: "Haraka Umbrella Stroller", description: "Extremely lightweight and simple fold.", price: 7000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller13/400/300", stock: 40 },
    { name: "Shujaa 3-Wheel Stroller", description: "Sporty design with enhanced maneuverability.", price: 23000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller14/400/300", stock: 9 },
    { name: "Malaika Bassinet Stroller Combo", description: "Includes detachable bassinet for newborns.", price: 27500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller15/400/300", stock: 11 },
    { name: "Stroller 16", description: "Reliable city stroller", price: 17000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller16/400/300", stock: 15 },
    { name: "Stroller 17", description: "Jogging companion", price: 22000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller17/400/300", stock: 10 },
    { name: "Stroller 18", description: "Budget friendly option", price: 11000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller18/400/300", stock: 28 },
    { name: "Stroller 19", description: "Double trouble twin stroller", price: 31000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller19/400/300", stock: 6 },
    { name: "Stroller 20", description: "Compact for small cars", price: 15500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller20/400/300", stock: 23 },
    { name: "Stroller 21", description: "Luxury feel stroller", price: 26000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller21/400/300", stock: 9 },
    { name: "Stroller 22", description: "Reversible handle stroller", price: 19000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller22/400/300", stock: 17 },
    { name: "Stroller 23", description: "Simple umbrella stroller", price: 8000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller23/400/300", stock: 35 },
    { name: "Stroller 24", description: "All-terrain adventure stroller", price: 24500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller24/400/300", stock: 11 },
    { name: "Stroller 25", description: "Travel system with car seat", price: 28500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller25/400/300", stock: 8 },
    { name: "Stroller 26", description: "Easy fold lightweight stroller", price: 13000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller26/400/300", stock: 26 },
    { name: "Stroller 27", description: "Stylish urban stroller", price: 20500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller27/400/300", stock: 13 },
    { name: "Stroller 28", description: "High-end twin stroller", price: 33000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller28/400/300", stock: 5 },
    { name: "Stroller 29", description: "Basic reliable stroller", price: 10000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller29/400/300", stock: 32 },
    { name: "Stroller 30", description: "Mid-range all-rounder", price: 17500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller30/400/300", stock: 19 },
    { name: "Stroller 31", description: "Comfort ride stroller", price: 21500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller31/400/300", stock: 14 },
    { name: "Stroller 32", description: "Compact travel stroller", price: 14800, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller32/400/300", stock: 21 },
    { name: "Stroller 33", description: "Robust jogging stroller", price: 30000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller33/400/300", stock: 7 },
    { name: "Stroller 34", description: "3-wheeler easy steer", price: 23500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller34/400/300", stock: 10 },
    { name: "Stroller 35", description: "Light city stroller", price: 16000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller35/400/300", stock: 24 },
    { name: "Stroller 36", description: "Affordable travel stroller", price: 11500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller36/400/300", stock: 29 },
    { name: "Stroller 37", description: "Premium comfort stroller", price: 27000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller37/400/300", stock: 9 },
    { name: "Stroller 38", description: "Reversible seat stroller", price: 19500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller38/400/300", stock: 16 },
    { name: "Stroller 39", description: "Light and easy fold", price: 12500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller39/400/300", stock: 27 },
    { name: "Stroller 40", description: "Top of the line luxury", price: 36000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller40/400/300", stock: 4 },
    { name: "Stroller 41", description: "Everyday reliable stroller", price: 18000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller41/400/300", stock: 17 },
    { name: "Stroller 42", description: "Sporty jogging stroller", price: 22500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller42/400/300", stock: 12 },
    { name: "Stroller 43", description: "Simple budget stroller", price: 10500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller43/400/300", stock: 31 },
    { name: "Stroller 44", description: "Full feature travel system", price: 29000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller44/400/300", stock: 7 },
    { name: "Stroller 45", description: "Compact city cruiser", price: 15000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller45/400/300", stock: 25 },
    { name: "Stroller 46", description: "Comfortable padded stroller", price: 20000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller46/400/300", stock: 15 },
    { name: "Stroller 47", description: "Tandem stroller for siblings", price: 31500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller47/400/300", stock: 6 },
    { name: "Stroller 48", description: "Ultra lightweight umbrella", price: 8500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller48/400/300", stock: 38 },
    { name: "Stroller 49", description: "Smooth suspension stroller", price: 25500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller49/400/300", stock: 10 },
    { name: "Stroller 50", description: "Feature-rich daily stroller", price: 18800, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller50/400/300", stock: 18 },


    // == Car Seats (Target: 50) ==
    { name: "Salama Infant Car Seat", description: "Rear-facing safety for newborns.", price: 9500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat1/400/300", stock: 30 },
    { name: "Safari Shield Convertible Car Seat", description: "Grows with your child, forward & rear-facing.", price: 15500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat2/400/300", stock: 18 },
    { name: "Tembo Booster Seat", description: "High-back booster for older kids.", price: 7000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat3/400/300", stock: 22 },
    { name: "Mzuri 360 Rotating Car Seat", description: "Easily rotate seat for access.", price: 24000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat4/400/300", stock: 10 },
    { name: "Kipepeo Infant Carrier", description: "Lightweight carrier with base.", price: 11000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat5/400/300", stock: 25 },
    { name: "Askari All-in-One Car Seat", description: "From infant to booster.", price: 21500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat6/400/300", stock: 15 },
    { name: "Cheetah Backless Booster", description: "Portable booster for older children.", price: 4500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat7/400/300", stock: 35 },
    { name: "Nyota Isofix Base", description: "Secure Isofix installation for compatible seats.", price: 8000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat8/400/300", stock: 12 },
    { name: "Raha Convertible Seat", description: "Extra padding for long journeys.", price: 17000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat9/400/300", stock: 16 },
    { name: "Safari Travel Car Seat", description: "Lightweight and airline-approved.", price: 13500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat10/400/300", stock: 20 },
    { name: "Chui SlimFit Car Seat", description: "Space-saving design for fitting multiple seats.", price: 19000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat11/400/300", stock: 14 },
    { name: "Imara Extended Rear-Facing Seat", description: "Allows rear-facing for longer.", price: 18000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat12/400/300", stock: 11 },
    { name: "Jasiri Pro Booster with Latch", description: "High-back booster with secure Latch system.", price: 9000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat13/400/300", stock: 19 },
    { name: "Toto Infant Capsule", description: "Lightweight capsule compatible with travel systems.", price: 12500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat14/400/300", stock: 28 },
    { name: "Nguvu SecureRide Convertible", description: "Enhanced side-impact protection.", price: 20500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat15/400/300", stock: 13 },
    { name: "Car Seat 16", description: "Comfortable convertible seat", price: 16000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat16/400/300", stock: 17 },
    { name: "Car Seat 17", description: "Rotating safety seat", price: 23000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat17/400/300", stock: 9 },
    { name: "Car Seat 18", description: "Basic infant carrier", price: 10000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat18/400/300", stock: 27 },
    { name: "Car Seat 19", description: "Travel approved seat", price: 14500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat19/400/300", stock: 21 },
    { name: "Car Seat 20", description: "High-end all-in-one", price: 25000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat20/400/300", stock: 8 },
    { name: "Car Seat 21", description: "Slim fit convertible", price: 19500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat21/400/300", stock: 13 },
    { name: "Car Seat 22", description: "Affordable booster seat", price: 8500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat22/400/300", stock: 20 },
    { name: "Car Seat 23", description: "Lightweight infant seat", price: 11500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat23/400/300", stock: 24 },
    { name: "Car Seat 24", description: "Premium rotating seat", price: 22500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat24/400/300", stock: 12 },
    { name: "Car Seat 25", description: "Padded convertible seat", price: 17500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat25/400/300", stock: 15 },
    { name: "Car Seat 26", description: "Basic backless booster", price: 6000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat26/400/300", stock: 32 },
    { name: "Car Seat 27", description: "Isofix compatible infant seat", price: 13000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat27/400/300", stock: 23 },
    { name: "Car Seat 28", description: "Side impact protection seat", price: 20000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat28/400/300", stock: 11 },
    { name: "Car Seat 29", description: "Extended rear facing option", price: 16500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat29/400/300", stock: 18 },
    { name: "Car Seat 30", description: "Latch system booster", price: 9800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat30/400/300", stock: 26 },
    { name: "Car Seat 31", description: "Comfort focused convertible", price: 18500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat31/400/300", stock: 14 },
    { name: "Car Seat 32", description: "Lightweight travel capsule", price: 12000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat32/400/300", stock: 25 },
    { name: "Car Seat 33", description: "Luxury all-in-one seat", price: 26000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat33/400/300", stock: 7 },
    { name: "Car Seat 34", description: "Standard convertible seat", price: 15000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat34/400/300", stock: 19 },
    { name: "Car Seat 35", description: "Enhanced safety features", price: 21000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat35/400/300", stock: 10 },
    { name: "Car Seat 36", description: "High-back booster", price: 7500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat36/400/300", stock: 30 },
    { name: "Car Seat 37", description: "Compact infant carrier", price: 14000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat37/400/300", stock: 22 },
    { name: "Car Seat 38", description: "Padded booster seat", price: 17800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat38/400/300", stock: 16 },
    { name: "Car Seat 39", description: "Easy install infant seat", price: 10500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat39/400/300", stock: 29 },
    { name: "Car Seat 40", description: "Top safety rated seat", price: 27000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat40/400/300", stock: 6 },
    { name: "Car Seat 41", description: "Slim profile car seat", price: 19800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat41/400/300", stock: 13 },
    { name: "Car Seat 42", description: "Simple infant carrier", price: 11800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat42/400/300", stock: 26 },
    { name: "Car Seat 43", description: "Rotating safety seat", price: 23500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat43/400/300", stock: 9 },
    { name: "Car Seat 44", description: "Convertible comfort seat", price: 15800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat44/400/300", stock: 18 },
    { name: "Car Seat 45", description: "Affordable Latch booster", price: 9200, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat45/400/300", stock: 28 },
    { name: "Car Seat 46", description: "Long use convertible", price: 16800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat46/400/300", stock: 17 },
    { name: "Car Seat 47", description: "Premium safety seat", price: 21800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat47/400/300", stock: 11 },
    { name: "Car Seat 48", description: "Basic backless booster seat", price: 5000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat48/400/300", stock: 38 },
    { name: "Car Seat 49", description: "Travel ready infant seat", price: 13800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat49/400/300", stock: 23 },
    { name: "Car Seat 50", description: "Robust convertible seat", price: 20800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat50/400/300", stock: 10 },


    // == Cribs (Target: 50) ==
    { name: "Lala Land Crib", description: "Modern design, converts to toddler bed.", price: 28000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib1/400/300", stock: 12 },
    { name: "Ndoto Mini Crib", description: "Space-saving design for smaller nurseries.", price: 19000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib2/400/300", stock: 10 },
    { name: "Safari Portable Crib", description: "Easy to set up for travel or visits.", price: 11500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib3/400/300", stock: 15 },
    { name: "Miti Convertible Crib", description: "4-in-1 crib (crib, toddler, daybed, full bed).", price: 34000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib4/400/300", stock: 8 },
    { name: "Zawadi Glider Crib with Drawer", description: "Includes under-crib storage drawer.", price: 31000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib5/400/300", stock: 9 },
    { name: "Jua Oval Crib", description: "Unique oval shape, stylish design.", price: 36500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib6/400/300", stock: 6 },
    { name: "Karibu Bassinet & Bedside Sleeper", description: "Keeps baby close during early months.", price: 16000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib7/400/300", stock: 14 },
    { name: "Asili Natural Wood Crib", description: "Solid wood construction, eco-friendly.", price: 29500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib8/400/300", stock: 11 },
    { name: "Malkia Canopy Crib", description: "Elegant crib with canopy frame.", price: 39000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib9/400/300", stock: 5 },
    { name: "Safari Travel Cot", description: "Lightweight cot with changing station.", price: 14500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib10/400/300", stock: 18 },
    { name: "Mwezi Rocking Bassinet", description: "Gentle rocking motion to soothe baby.", price: 17500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib11/400/300", stock: 13 },
    { name: "Kisasa Modern Crib", description: "Sleek lines and minimalist aesthetic.", price: 32000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib12/400/300", stock: 7 },
    { name: "Kunja Folding Crib", description: "Folds flat for easy storage.", price: 22000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib13/400/300", stock: 9 },
    { name: "Mviringo Round Crib", description: "Unique circular design statement piece.", price: 42000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib14/400/300", stock: 4 },
    { name: "Pamoja Crib with Changing Table Combo", description: "Integrated changing table for convenience.", price: 37000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib15/400/300", stock: 10 },
    { name: "Crib 16", description: "Convertible crib", price: 26000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib16/400/300", stock: 13 },
    { name: "Crib 17", description: "Mini crib for small spaces", price: 18000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib17/400/300", stock: 11 },
    { name: "Crib 18", description: "Crib with storage", price: 30000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib18/400/300", stock: 8 },
    { name: "Crib 19", description: "Portable travel crib", price: 21000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib19/400/300", stock: 14 },
    { name: "Crib 20", description: "Luxury wooden crib", price: 35000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib20/400/300", stock: 7 },
    { name: "Crib 21", description: "Simple bassinet", price: 17000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib21/400/300", stock: 16 },
    { name: "Crib 22", description: "Modern design crib", price: 23000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib22/400/300", stock: 10 },
    { name: "Crib 23", description: "Affordable basic crib", price: 12500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib23/400/300", stock: 19 },
    { name: "Crib 24", description: "Round statement crib", price: 40000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib24/400/300", stock: 5 },
    { name: "Crib 25", description: "Crib and changer combo", price: 27000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib25/400/300", stock: 9 },
    { name: "Crib 26", description: "Rocking crib", price: 19500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib26/400/300", stock: 12 },
    { name: "Crib 27", description: "Natural wood finish crib", price: 33000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib27/400/300", stock: 7 },
    { name: "Crib 28", description: "Bedside sleeper crib", price: 15000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib28/400/300", stock: 17 },
    { name: "Crib 29", description: "Folding travel crib", price: 24000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib29/400/300", stock: 10 },
    { name: "Crib 30", description: "Canopy style crib", price: 38000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib30/400/300", stock: 6 },
    { name: "Crib 31", description: "Basic travel cot", price: 10000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib31/400/300", stock: 20 },
    { name: "Crib 32", description: "Solid wood convertible crib", price: 29000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib32/400/300", stock: 9 },
    { name: "Crib 33", description: "Compact mini crib", price: 20000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib33/400/300", stock: 11 },
    { name: "Crib 34", description: "Crib with under drawer", price: 31500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib34/400/300", stock: 8 },
    { name: "Crib 35", description: "Portable bassinet", price: 13500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib35/400/300", stock: 18 },
    { name: "Crib 36", description: "Standard convertible crib", price: 25000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib36/400/300", stock: 10 },
    { name: "Crib 37", description: "Lightweight travel crib", price: 16500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib37/400/300", stock: 15 },
    { name: "Crib 38", description: "Oval luxury crib", price: 41000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib38/400/300", stock: 4 },
    { name: "Crib 39", description: "Simple folding crib", price: 22500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib39/400/300", stock: 9 },
    { name: "Crib 40", description: "Modern minimalist crib", price: 36000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib40/400/300", stock: 6 },
    { name: "Crib 41", description: "Rocking bassinet", price: 18500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib41/400/300", stock: 12 },
    { name: "Crib 42", description: "Eco-friendly wood crib", price: 28500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib42/400/300", stock: 9 },
    { name: "Crib 43", description: "Basic portable crib", price: 11000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib43/400/300", stock: 20 },
    { name: "Crib 44", description: "Elegant canopy crib", price: 39500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib44/400/300", stock: 5 },
    { name: "Crib 45", description: "Crib with changing top", price: 15500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib45/400/300", stock: 16 },
    { name: "Crib 46", description: "4-in-1 convertible crib", price: 26500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib46/400/300", stock: 10 },
    { name: "Crib 47", description: "Space saver mini crib", price: 19800, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib47/400/300", stock: 13 },
    { name: "Crib 48", description: "Modern style crib", price: 32500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib48/400/300", stock: 7 },
    { name: "Crib 49", description: "Travel cot with changer", price: 14000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib49/400/300", stock: 17 },
    { name: "Crib 50", description: "Standard wooden crib", price: 21500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib50/400/300", stock: 11 },

    // == Baby Monitors (Target: 50) ==
    { name: "Mlinzi Video Monitor", description: "HD video and two-way audio.", price: 13000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor1/400/300", stock: 40 },
    { name: "Sauti Audio Monitor", description: "Clear sound, long range.", price: 4500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor2/400/300", stock: 50 },
    { name: "Smart Angalia Monitor with App", description: "Connects to your phone, tracks vitals.", price: 22000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor3/400/300", stock: 10 },
    { name: "Pacha View Dual Camera Monitor", description: "Monitor two rooms or angles.", price: 18500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor4/400/300", stock: 15 },
    { name: "Tuliza Sound Soother Monitor", description: "Includes nightlight and lullabies.", price: 9500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor5/400/300", stock: 25 },
    { name: "Vaa Wearable Movement Monitor", description: "Tracks baby's breathing movements.", price: 16000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor6/400/300", stock: 12 },
    { name: "Mbali Long Range Audio Monitor", description: "Extended range for larger homes.", price: 6000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor7/400/300", stock: 30 },
    { name: "Mtandao Wi-Fi Monitor", description: "Access video feed from anywhere via Wi-Fi.", price: 15500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor8/400/300", stock: 20 },
    { name: "Rahisi Simple Audio Monitor", description: "Basic, reliable audio monitoring.", price: 3800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor9/400/300", stock: 45 },
    { name: "Pro Angalia Video Monitor System", description: "Pan/tilt/zoom camera, temperature sensor.", price: 25000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor10/400/300", stock: 8 },
    { name: "Split Screen Monitor", description: "View multiple cameras simultaneously.", price: 20000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor11/400/300", stock: 13 },
    { name: "Salama Low Emission Audio Monitor", description: "Designed for minimal EMF emissions.", price: 7500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor12/400/300", stock: 28 },
    { name: "Portable Video Monitor", description: "Compact monitor unit for easy carrying.", price: 14000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor13/400/300", stock: 18 },
    { name: "Pumua Breathing Sensor Pad Monitor", description: "Under-mattress sensor pad detects movement.", price: 19500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor14/400/300", stock: 9 },
    { name: "Smart Sock Monitor", description: "Tracks heart rate and oxygen levels.", price: 32000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor15/400/300", stock: 7 },
    { name: "Monitor 16", description: "Video monitor with temperature sensor", price: 17000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor16/400/300", stock: 16 },
    { name: "Monitor 17", description: "Basic audio monitor", price: 11000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor17/400/300", stock: 22 },
    { name: "Monitor 18", description: "Wi-Fi video monitor", price: 23000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor18/400/300", stock: 9 },
    { name: "Monitor 19", description: "Long range audio monitor", price: 8000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor19/400/300", stock: 32 },
    { name: "Monitor 20", description: "Smart monitor with app control", price: 28000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor20/400/300", stock: 6 },
    { name: "Monitor 21", description: "Portable video monitor", price: 14500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor21/400/300", stock: 19 },
    { name: "Monitor 22", description: "Dual camera video monitor", price: 19000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor22/400/300", stock: 14 },
    { name: "Monitor 23", description: "Simple plug-in audio monitor", price: 5000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor23/400/300", stock: 48 },
    { name: "Monitor 24", description: "Movement sensor pad monitor", price: 21000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor24/400/300", stock: 11 },
    { name: "Monitor 25", description: "Video monitor with night vision", price: 12000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor25/400/300", stock: 26 },
    { name: "Monitor 26", description: "Video monitor with lullabies", price: 17500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor26/400/300", stock: 17 },
    { name: "Monitor 27", description: "High definition video monitor", price: 26000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor27/400/300", stock: 7 },
    { name: "Monitor 28", description: "Audio monitor with night light", price: 9000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor28/400/300", stock: 29 },
    { name: "Monitor 29", description: "Wearable baby monitor", price: 15000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor29/400/300", stock: 21 },
    { name: "Monitor 30", description: "Pan/tilt/zoom camera monitor", price: 24000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor30/400/300", stock: 8 },
    { name: "Monitor 31", description: "Low emission audio monitor", price: 6500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor31/400/300", stock: 35 },
    { name: "Monitor 32", description: "Split screen video monitor", price: 18000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor32/400/300", stock: 15 },
    { name: "Monitor 33", description: "Audio monitor with two parent units", price: 10500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor33/400/300", stock: 27 },
    { name: "Monitor 34", description: "Breathing monitor pad", price: 20500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor34/400/300", stock: 12 },
    { name: "Monitor 35", description: "Video monitor, compact screen", price: 13500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor35/400/300", stock: 23 },
    { name: "Monitor 36", description: "Smart sock vital tracker", price: 29000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor36/400/300", stock: 5 },
    { name: "Monitor 37", description: "Reliable video monitor", price: 16500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor37/400/300", stock: 18 },
    { name: "Monitor 38", description: "Basic long range audio", price: 7000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor38/400/300", stock: 38 },
    { name: "Monitor 39", description: "Wi-Fi monitor with remote access", price: 22500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor39/400/300", stock: 10 },
    { name: "Monitor 40", description: "Video monitor with clear audio", price: 11500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor40/400/300", stock: 24 },
    { name: "Monitor 41", description: "Premium dual camera system", price: 27000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor41/400/300", stock: 7 },
    { name: "Monitor 42", description: "Video monitor with sound activation", price: 18800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor42/400/300", stock: 14 },
    { name: "Monitor 43", description: "Audio monitor with projector", price: 9800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor43/400/300", stock: 31 },
    { name: "Monitor 44", description: "High-end video monitor system", price: 25500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor44/400/300", stock: 8 },
    { name: "Monitor 45", description: "Standard video baby monitor", price: 12800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor45/400/300", stock: 25 },
    { name: "Monitor 46", description: "Movement and video monitor combo", price: 21500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor46/400/300", stock: 11 },
    { name: "Monitor 47", description: "Portable video monitor", price: 15800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor47/400/300", stock: 20 },
    { name: "Monitor 48", description: "Affordable audio monitor", price: 4200, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor48/400/300", stock: 52 },
    { name: "Monitor 49", description: "Video monitor with split screen", price: 19800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor49/400/300", stock: 13 },
    { name: "Monitor 50", description: "Top tier smart monitor", price: 30000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor50/400/300", stock: 4 },


    // == Feeding (Target: 50) ==
    { name: "Kula High Chair", description: "Adjustable height, easy to clean.", price: 8500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding1/400/300", stock: 28 },
    { name: "Moto Bottle Warmer", description: "Warms milk quickly and evenly.", price: 3500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding2/400/300", stock: 35 },
    { name: "Vijiko Spoons (Set of 5)", description: "Soft-tip spoons for first solids.", price: 800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding3/400/300", stock: 100 },
    { name: "Kinga Bib Set (3 pack)", description: "Waterproof and easy wipe.", price: 1200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding4/400/300", stock: 80 },
    { name: "Kua Convertible High Chair", description: "Converts to booster and toddler chair.", price: 14500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding5/400/300", stock: 20 },
    { name: "Safi Steam Sterilizer & Dryer", description: "Sterilizes bottles and accessories.", price: 6500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding6/400/300", stock: 15 },
    { name: "Sahani Silicone Plate Set", description: "Suction base plate and utensils.", price: 1800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding7/400/300", stock: 50 },
    { name: "Mto Nursing Pillow", description: "Provides support for feeding.", price: 4200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding8/400/300", stock: 30 },
    { name: "Maziwa Formula Mixer Pitcher", description: "Mixes formula easily without clumps.", price: 2500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding9/400/300", stock: 40 },
    { name: "Vitafunio Snack Catcher Cups (2 pack)", description: "Spill-proof snack containers.", price: 1000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding10/400/300", stock: 70 },
    { name: "Brashi Bottle Brush Set", description: "Includes various brushes for cleaning.", price: 950, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding11/400/300", stock: 65 },
    { name: "Mpishi Baby Food Maker", description: "Steams and blends baby food.", price: 9800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding12/400/300", stock: 12 },
    { name: "Kikombe Sippy Cup Set (3 stages)", description: "Transition cups for different ages.", price: 1500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding13/400/300", stock: 55 },
    { name: "Pampu Breast Pump (Electric)", description: "Double electric breast pump.", price: 15000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding14/400/300", stock: 10 },
    { name: "Kiti Portable High Chair", description: "Clamps onto tables for on-the-go feeding.", price: 6000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding15/400/300", stock: 25 },
    { name: "Feeding Item 16", description: "Silicone bibs (2 pack)", price: 2200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding16/400/300", stock: 45 },
    { name: "Feeding Item 17", description: "Baby feeding spoons", price: 500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding17/400/300", stock: 120 },
    { name: "Feeding Item 18", description: "Bottle sterilizer", price: 7200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding18/400/300", stock: 18 },
    { name: "Feeding Item 19", description: "Insulated bottle bag", price: 3000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding19/400/300", stock: 38 },
    { name: "Feeding Item 20", description: "Manual breast pump", price: 11000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding20/400/300", stock: 14 },
    { name: "Feeding Item 21", description: "Mesh feeder (2 pack)", price: 1300, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding21/400/300", stock: 60 },
    { name: "Feeding Item 22", description: "Nursing cover", price: 4800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding22/400/300", stock: 26 },
    { name: "Feeding Item 23", description: "Sippy cup with straw", price: 1600, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding23/400/300", stock: 52 },
    { name: "Feeding Item 24", description: "High chair splash mat", price: 8800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding24/400/300", stock: 16 },
    { name: "Feeding Item 25", description: "Baby food storage containers", price: 2000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding25/400/300", stock: 48 },
    { name: "Feeding Item 26", description: "Electric bottle warmer", price: 5500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding26/400/300", stock: 22 },
    { name: "Feeding Item 27", description: "Bottle drying rack", price: 900, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding27/400/300", stock: 90 },
    { name: "Feeding Item 28", description: "Baby food processor", price: 12500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding28/400/300", stock: 11 },
    { name: "Feeding Item 29", description: "Breast milk storage bags", price: 3800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding29/400/300", stock: 33 },
    { name: "Feeding Item 30", description: "Toddler utensil set", price: 1700, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding30/400/300", stock: 50 },
    { name: "Feeding Item 31", description: "Portable high chair booster", price: 6800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding31/400/300", stock: 19 },
    { name: "Feeding Item 32", description: "Formula dispenser", price: 2800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding32/400/300", stock: 40 },
    { name: "Feeding Item 33", description: "Convertible high chair", price: 10500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding33/400/300", stock: 13 },
    { name: "Feeding Item 34", description: "Nursing pillow cover", price: 4000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding34/400/300", stock: 31 },
    { name: "Feeding Item 35", description: "Suction bowl set", price: 1900, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding35/400/300", stock: 49 },
    { name: "Feeding Item 36", description: "Wooden high chair", price: 8000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding36/400/300", stock: 17 },
    { name: "Feeding Item 37", description: "Baby bottle cleaning set", price: 1100, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding37/400/300", stock: 75 },
    { name: "Feeding Item 38", description: "Travel bottle warmer", price: 5200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding38/400/300", stock: 24 },
    { name: "Feeding Item 39", description: "Silicone placemat", price: 3300, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding39/400/300", stock: 36 },
    { name: "Feeding Item 40", description: "Double electric breast pump", price: 13800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding40/400/300", stock: 10 },
    { name: "Feeding Item 41", description: "Bottle nipple variety pack", price: 750, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding41/400/300", stock: 110 },
    { name: "Feeding Item 42", description: "Baby food steamer", price: 9500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding42/400/300", stock: 15 },
    { name: "Feeding Item 43", description: "Training cup set", price: 2400, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding43/400/300", stock: 42 },
    { name: "Feeding Item 44", description: "Hook-on high chair", price: 6200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding44/400/300", stock: 21 },
    { name: "Feeding Item 45", description: "Baby bib with pocket", price: 1400, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding45/400/300", stock: 58 },
    { name: "Feeding Item 46", description: "Multi-stage high chair", price: 4500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding46/400/300", stock: 29 },
    { name: "Feeding Item 47", description: "Microwave sterilizer bags", price: 10000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding47/400/300", stock: 12 },
    { name: "Feeding Item 48", description: "Toddler feeding plate set", price: 2100, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding48/400/300", stock: 46 },
    { name: "Feeding Item 49", description: "Sterilizer and dryer combo", price: 7800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding49/400/300", stock: 18 },
    { name: "Feeding Item 50", description: "High-end baby food maker", price: 12000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding50/400/300", stock: 11 },

     // == Clothing (Target: 50) ==
    { name: "Nyota Explorer Onesie (3-pack)", description: "Soft cotton, size 0-3 months.", price: 2500, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing1/400/300", stock: 60 },
    { name: "Usiku Pajamas (Size 1T)", description: "Cozy fleece for chilly nights.", price: 1800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing2/400/300", stock: 45 },
    { name: "Jua Sun Hat", description: "UPF 50+ protection.", price: 950, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing3/400/300", stock: 70 },
    { name: "Lala Sleep Sack (0-6M)", description: "Wearable blanket for safe sleep.", price: 2800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing4/400/300", stock: 50 },
    { name: "Kitenge Romper Set (2 pack, 6-9M)", description: "Cute and comfortable rompers.", price: 2200, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing5/400/300", stock: 55 },
    { name: "Baridi Knit Cardigan (12-18M)", description: "Stylish layer for cooler days.", price: 2000, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing6/400/300", stock: 40 },
    { name: "Safari Adventure Leggings (3 pack, 2T)", description: "Stretchy and durable leggings.", price: 1900, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing7/400/300", stock: 65 },
    { name: "Pamba Organic Cotton Bodysuit Set (5 pack, NB)", description: "Gentle on newborn skin.", price: 3000, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing8/400/300", stock: 58 },
    { name: "Viatu Socks & Booties Set", description: "Keep little feet warm.", price: 700, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing9/400/300", stock: 90 },
    { name: "Mvua Rain Jacket (3T)", description: "Waterproof jacket for puddle jumping.", price: 3500, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing10/400/300", stock: 35 },
    { name: "T-shati Cotton T-Shirt Set (4 pack, 18M)", description: "Everyday essential t-shirts.", price: 1600, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing11/400/300", stock: 75 },
    { name: "Dungaree Denim Overalls (2T)", description: "Classic and durable overalls.", price: 2400, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing12/400/300", stock: 42 },
    { name: "Theluji Fleece Lined Snowsuit (12M)", description: "Warm suit for winter weather.", price: 4500, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing13/400/300", stock: 25 },
    { name: "Sherehe Party Dress (3T)", description: "Sparkly dress for special occasions.", price: 2900, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing14/400/300", stock: 30 },
    { name: "Kuogelea Swimsuit Set (2T)", description: "Includes rash guard and swim trunks.", price: 2100, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing15/400/300", stock: 50 },
    { name: "Clothing Item 16", description: "Cotton leggings (3 pack)", price: 1500, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing16/400/300", stock: 80 },
    { name: "Clothing Item 17", description: "Warm fleece jacket", price: 3200, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing17/400/300", stock: 38 },
    { name: "Clothing Item 18", description: "Baby socks (6 pairs)", price: 1100, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing18/400/300", stock: 68 },
    { name: "Clothing Item 19", description: "Sweater and pants set", price: 2600, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing19/400/300", stock: 44 },
    { name: "Clothing Item 20", description: "Basic short sleeve bodysuits (5 pack)", price: 1700, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing20/400/300", stock: 52 },
    { name: "Clothing Item 21", description: "Winter snowsuit", price: 4000, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing21/400/300", stock: 28 },
    { name: "Clothing Item 22", description: "Baby mittens (3 pairs)", price: 800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing22/400/300", stock: 100 },
    { name: "Clothing Item 23", description: "Denim jeans for toddler", price: 2300, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing23/400/300", stock: 48 },
    { name: "Clothing Item 24", description: "Hooded towel set", price: 3800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing24/400/300", stock: 32 },
    { name: "Clothing Item 25", description: "Sleep and play footies (3 pack)", price: 1400, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing25/400/300", stock: 62 },
    { name: "Clothing Item 26", description: "Formal outfit set", price: 2700, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing26/400/300", stock: 40 },
    { name: "Clothing Item 27", description: "Long sleeve t-shirt set (4 pack)", price: 1950, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing27/400/300", stock: 56 },
    { name: "Clothing Item 28", description: "Knit hat and scarf set", price: 3100, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing28/400/300", stock: 36 },
    { name: "Clothing Item 29", description: "Baby booties", price: 1000, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing29/400/300", stock: 85 },
    { name: "Clothing Item 30", description: "Summer romper set (2 pack)", price: 2050, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing30/400/300", stock: 50 },
    { name: "Clothing Item 31", description: "Fleece lined pants", price: 4200, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing31/400/300", stock: 26 },
    { name: "Clothing Item 32", description: "Organic cotton pajamas", price: 1250, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing32/400/300", stock: 65 },
    { name: "Clothing Item 33", description: "Party wear frock", price: 2950, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing33/400/300", stock: 39 },
    { name: "Clothing Item 34", description: "Everyday t-shirt pack", price: 1850, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing34/400/300", stock: 53 },
    { name: "Clothing Item 35", description: "Rain boots", price: 3600, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing35/400/300", stock: 30 },
    { name: "Clothing Item 36", description: "Sun protection hat", price: 900, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing36/400/300", stock: 95 },
    { name: "Clothing Item 37", description: "Overall shorts set", price: 2450, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing37/400/300", stock: 46 },
    { name: "Clothing Item 38", description: "Knit sweater", price: 3300, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing38/400/300", stock: 34 },
    { name: "Clothing Item 39", description: "Footed sleep sack", price: 1300, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing39/400/300", stock: 64 },
    { name: "Clothing Item 40", description: "Tank top set (3 pack)", price: 2150, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing40/400/300", stock: 49 },
    { name: "Clothing Item 41", description: "Heavy winter coat", price: 4800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing41/400/300", stock: 22 },
    { name: "Clothing Item 42", description: "Shorts set (3 pack)", price: 1650, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing42/400/300", stock: 59 },
    { name: "Clothing Item 43", description: "Christening gown", price: 3050, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing43/400/300", stock: 37 },
    { name: "Clothing Item 44", description: "Basic long sleeve bodysuits (5 pack)", price: 1750, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing44/400/300", stock: 54 },
    { name: "Clothing Item 45", description: "Waterproof rain pants", price: 3900, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing45/400/300", stock: 29 },
    { name: "Clothing Item 46", description: "Baby headband set", price: 750, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing46/400/300", stock: 110 },
    { name: "Clothing Item 47", description: "Hoodie and jogger set", price: 2550, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing47/400/300", stock: 45 },
    { name: "Clothing Item 48", description: "Lightweight cardigan", price: 3400, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing48/400/300", stock: 33 },
    { name: "Clothing Item 49", description: "Swaddle blanket set", price: 1200, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing49/400/300", stock: 72 },
    { name: "Clothing Item 50", description: "Cute animal themed outfit", price: 2850, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing50/400/300", stock: 41 },

     // == Toys (Target: 50) ==
    { name: "Dunia Plushie Rattle", description: "Soft textures and gentle rattle sound.", price: 750, category: "Toys", imageUrl: "https://picsum.photos/seed/toy1/400/300", stock: 90 },
    { name: "Cheza Activity Gym", description: "Engaging mat with hanging toys.", price: 6500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy2/400/300", stock: 20 },
    { name: "Jenga Blocks Universe Set", description: "Wooden blocks for creative play.", price: 3200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy3/400/300", stock: 30 },
    { name: "Nyota Star Projector", description: "Projects stars onto ceiling, plays music.", price: 2900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy4/400/300", stock: 25 },
    { name: "Mipira Sensory Ball Pit", description: "Includes soft balls for sensory play.", price: 7500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy5/400/300", stock: 15 },
    { name: "Panga Stacking Rings", description: "Classic stacking toy for coordination.", price: 1200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy6/400/300", stock: 60 },
    { name: "Kitabu Soft Cloth Book Set", description: "Crinkle books for early learning.", price: 1500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy7/400/300", stock: 50 },
    { name: "Bembea Musical Mobile", description: "Crib mobile with soothing melodies.", price: 4800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy8/400/300", stock: 18 },
    { name: "Endesha Ride-On Toy", description: "Fun ride-on for toddlers.", price: 5500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy9/400/300", stock: 22 },
    { name: "Maji Bath Toy Set", description: "Floating toys for bath time fun.", price: 900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy10/400/300", stock: 75 },
    { name: "Umbo Shape Sorter", description: "Helps develop shape recognition.", price: 1400, category: "Toys", imageUrl: "https://picsum.photos/seed/toy11/400/300", stock: 58 },
    { name: "Tembea Push Walker", description: "Helps babies learning to walk.", price: 4200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy12/400/300", stock: 28 },
    { name: "Picha Wooden Puzzle Set", description: "Simple puzzles for toddlers.", price: 1800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy13/400/300", stock: 45 },
    { name: "Jikoni Play Kitchenette", description: "Mini kitchen for imaginative play.", price: 8900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy14/400/300", stock: 12 },
    { name: "Muziki Musical Instrument Set", description: "Includes shakers, drum, xylophone.", price: 3500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy15/400/300", stock: 35 },
    { name: "Toy 16", description: "Soft stacking blocks", price: 2500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy16/400/300", stock: 40 },
    { name: "Toy 17", description: "Baby rattle set", price: 1100, category: "Toys", imageUrl: "https://picsum.photos/seed/toy17/400/300", stock: 65 },
    { name: "Toy 18", description: "Activity cube toy", price: 5800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy18/400/300", stock: 19 },
    { name: "Toy 19", description: "Push and pull toy", price: 1900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy19/400/300", stock: 52 },
    { name: "Toy 20", description: "Wooden train set", price: 4000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy20/400/300", stock: 26 },
    { name: "Toy 21", description: "Teething toy set", price: 850, category: "Toys", imageUrl: "https://picsum.photos/seed/toy21/400/300", stock: 85 },
    { name: "Toy 22", description: "Baby mirror toy", price: 3000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy22/400/300", stock: 33 },
    { name: "Toy 23", description: "Shape sorting cube", price: 1600, category: "Toys", imageUrl: "https://picsum.photos/seed/toy23/400/300", stock: 55 },
    { name: "Toy 24", description: "Ball pit with balls", price: 7000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy24/400/300", stock: 16 },
    { name: "Toy 25", description: "Stacking cups toy", price: 2200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy25/400/300", stock: 48 },
    { name: "Toy 26", description: "Musical keyboard toy", price: 4500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy26/400/300", stock: 24 },
    { name: "Toy 27", description: "Cloth book set", price: 1300, category: "Toys", imageUrl: "https://picsum.photos/seed/toy27/400/300", stock: 62 },
    { name: "Toy 28", description: "Play mat with arches", price: 6200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy28/400/300", stock: 17 },
    { name: "Toy 29", description: "Wooden puzzle set", price: 2000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy29/400/300", stock: 50 },
    { name: "Toy 30", description: "Ride-on car toy", price: 5000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy30/400/300", stock: 21 },
    { name: "Toy 31", description: "Bath toy squirters", price: 1000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy31/400/300", stock: 70 },
    { name: "Toy 32", description: "Baby drum set", price: 3800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy32/400/300", stock: 29 },
    { name: "Toy 33", description: "Classic ring stacker", price: 1700, category: "Toys", imageUrl: "https://picsum.photos/seed/toy33/400/300", stock: 53 },
    { name: "Toy 34", description: "Large play kitchen set", price: 8000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy34/400/300", stock: 14 },
    { name: "Toy 35", description: "Building block set", price: 2700, category: "Toys", imageUrl: "https://picsum.photos/seed/toy35/400/300", stock: 42 },
    { name: "Toy 36", description: "Plush animal mobile", price: 4900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy36/400/300", stock: 23 },
    { name: "Toy 37", description: "Sensory ball set", price: 1250, category: "Toys", imageUrl: "https://picsum.photos/seed/toy37/400/300", stock: 68 },
    { name: "Toy 38", description: "Interactive learning table", price: 6800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy38/400/300", stock: 15 },
    { name: "Toy 39", description: "Shape sorter truck", price: 2100, category: "Toys", imageUrl: "https://picsum.photos/seed/toy39/400/300", stock: 49 },
    { name: "Toy 40", description: "Walker with activity panel", price: 5300, category: "Toys", imageUrl: "https://picsum.photos/seed/toy40/400/300", stock: 20 },
    { name: "Toy 41", description: "Floating bath book", price: 950, category: "Toys", imageUrl: "https://picsum.photos/seed/toy41/400/300", stock: 80 },
    { name: "Toy 42", description: "Musical xylophone toy", price: 3600, category: "Toys", imageUrl: "https://picsum.photos/seed/toy42/400/300", stock: 31 },
    { name: "Toy 43", description: "Soft animal plush set", price: 1550, category: "Toys", imageUrl: "https://picsum.photos/seed/toy43/400/300", stock: 57 },
    { name: "Toy 44", description: "Baby gym play mat", price: 7200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy44/400/300", stock: 18 },
    { name: "Toy 45", description: "Wooden stacking train", price: 2400, category: "Toys", imageUrl: "https://picsum.photos/seed/toy45/400/300", stock: 46 },
    { name: "Toy 46", description: "Toy phone with sounds", price: 4700, category: "Toys", imageUrl: "https://picsum.photos/seed/toy46/400/300", stock: 25 },
    { name: "Toy 47", description: "Crinkle cloth book", price: 1150, category: "Toys", imageUrl: "https://picsum.photos/seed/toy47/400/300", stock: 69 },
    { name: "Toy 48", description: "Activity walker", price: 6000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy48/400/300", stock: 19 },
    { name: "Toy 49", description: "Wooden animal puzzle", price: 1850, category: "Toys", imageUrl: "https://picsum.photos/seed/toy49/400/300", stock: 54 },
    { name: "Toy 50", description: "Musical mobile for crib", price: 5100, category: "Toys", imageUrl: "https://picsum.photos/seed/toy50/400/300", stock: 22 },
];


// --- Function to clear existing collection (Use with caution!) ---
async function clearCollection(collectionPath: string) {
    console.log(`🧹 Clearing collection: ${collectionPath}...`);
    const collectionRef = db.collection(collectionPath);
    let deletedCount = 0;

    // Delete documents in batches
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
      deletedCount += snapshot.size;
      console.log(`   Deleted ${snapshot.size} documents (Total: ${deletedCount})...`);
    } while (snapshot.size > 0);

    console.log(`✅ Collection ${collectionPath} cleared. ${deletedCount} documents removed.`);
}

// --- Function to add data in batches ---
async function seedData() {
    console.log('🌱 Starting Firestore seeding...');
    const startTime = Date.now();

    // **Optional: Uncomment to clear existing data before seeding**
    // console.warn("\\n🚨 WARNING: Clearing existing data in 5 seconds! Press Ctrl+C to cancel.\\n");
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // await clearCollection(COLLECTION_NAME);
    // console.log("⏱ Waiting 2 seconds after clearing before seeding...");
    // await new Promise(resolve => setTimeout(resolve, 2000));


    const collectionRef = db.collection(COLLECTION_NAME);
    let batch = db.batch();
    let count = 0;
    const totalProducts = sampleProducts.length;

    console.log(`📦 Preparing to add ${totalProducts} products...`);

    for (const productData of sampleProducts) {
        const docRef = collectionRef.doc(); // Let Firestore generate the ID
        batch.set(docRef, productData);
        count++;

        if (count % BATCH_SIZE === 0 || count === totalProducts) {
            const batchNum = Math.ceil(count / BATCH_SIZE);
            const itemsInBatch = (count % BATCH_SIZE === 0) ? BATCH_SIZE : count % BATCH_SIZE;
            console.log(`   Committing batch ${batchNum} (${itemsInBatch} products)...`);
            await batch.commit();
            if (count < totalProducts) {
                batch = db.batch(); // Start a new batch only if there are more items
            }
        }
    }


    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2); // Duration in seconds

    console.log(`\\n✅ Seeding complete! Added ${count} products to '${COLLECTION_NAME}' in ${duration} seconds.`);
}

// --- Run the Seeding Process ---
seedData().catch((error) => {
    console.error('\\n❌ Error during Firestore seeding:', error);
    process.exit(1);
});
