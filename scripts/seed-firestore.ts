
/**
 * Firestore Seeding Script
 *
 * How to run:
 * 1.  Ensure you have a `.env.local` file in your project root with your
 *     Firebase configuration variables (e.g., NEXT_PUBLIC_FIREBASE_PROJECT_ID).
 *     **REPLACE THE PLACEHOLDER VALUES in `.env.local` with your actual Firebase credentials.**
 * 2.  Get Service Account Credentials:
 *     - Go to your Firebase Project Settings > Service accounts.
 *     - Click "Generate new private key" and download the JSON file.
 *     - **IMPORTANT:** Rename this file (e.g., `serviceAccountKey.json`) and place it in a secure location *outside* your project's source control (add it to `.gitignore`). **NEVER COMMIT THIS FILE.**
 *     - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable in your *terminal* (not in .env.local) to the *full path* of this downloaded JSON file.
 *       - On Linux/macOS: `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"`
 *       - On Windows (PowerShell): `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\serviceAccountKey.json"`
 *       - (You might need to set this variable each time you open a new terminal, or add it to your shell's profile script like .bashrc or .zshrc)
 * 3.  Install Dependencies:
 *     - Run `npm install` or `yarn install` in your project root if you haven't already (to install `firebase-admin`, `tsx`, `dotenv-cli`).
 * 4.  Run the Script:
 *     - Execute the script from your project root using: `npm run seed:firestore`
 *
 * This script will:
 * - Connect to your Firestore database using Admin privileges.
 * - Add sample product data using batch writes.
 * - **By default, it DOES NOT clear existing data.** Uncomment the `clearCollection` line if you want to wipe the collection first.
 */
// `dotenv-cli` in package.json's script handles loading .env.local
import path from 'path';
import admin from 'firebase-admin';
import type { Product } from '@/types/product'; // Adjust path if necessary


// --- Configuration ---
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID; // Get Project ID from env loaded by dotenv-cli
const COLLECTION_NAME = 'products';
const BATCH_SIZE = 100; // Firestore batch write limit is 500 operations

// --- Environment Variable Validation ---
if (!PROJECT_ID || PROJECT_ID === "YOUR_PROJECT_ID_HERE") {
  const errorMessage =
    `Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable not set or still has the placeholder value. ` +
    `Please ensure it is set correctly in your .env.local file and you have replaced "YOUR_PROJECT_ID_HERE" with your actual Firebase Project ID. ` +
    `Remember to restart your terminal or source your profile if you set it globally.`;
  console.error("\n❌ Configuration Error:\n", errorMessage, "\n");
  process.exit(1); // Exit if the crucial Project ID is missing or is the placeholder
}

// Validate other required environment variables if needed by the admin SDK indirectly
// (though GOOGLE_APPLICATION_CREDENTIALS is the main one for admin)
const requiredEnvVarsForAdmin = [
  // Add other NEXT_PUBLIC_ vars if the *admin* SDK specifically needs them, which is unlikely
];
const missingEnvVars = requiredEnvVarsForAdmin.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  const errorMessage =
    `Missing other required environment variables for seeding script: ${missingEnvVars.join(', ')}. ` +
    `Please ensure they are set in your .env.local file.`;
  console.error("Error:", errorMessage);
  process.exit(1); // Exit if required variables are missing
}


// --- Initialize Firebase Admin SDK ---
try {
    // Check if GOOGLE_APPLICATION_CREDENTIALS is set
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.error("\n❌ Configuration Error:");
        console.error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set in your terminal.");
        console.error("This variable must point to the full path of your downloaded service account key JSON file.");
        console.error("Example (Linux/macOS): export GOOGLE_APPLICATION_CREDENTIALS=\"/path/to/your/serviceAccountKey.json\"");
        console.error("Example (Windows PowerShell): $env:GOOGLE_APPLICATION_CREDENTIALS = \"C:\\path\\to\\your\\serviceAccountKey.json\"");
        console.error("Please set this variable in your current terminal session before running the script.\n");
        process.exit(1);

    } else {
        // Initialize with explicit credentials from the environment variable
        admin.initializeApp({
            // Credential is automatically found from GOOGLE_APPLICATION_CREDENTIALS env var
            projectId: PROJECT_ID, // Use the validated PROJECT_ID
         });
         console.log(`🔑 Firebase Admin SDK initialized for project: ${PROJECT_ID}`);
    }


} catch (error: any) {
    if (error.code === 'app/duplicate-app') {
        console.log('ℹ️ Firebase Admin SDK already initialized.');
    } else {
        console.error('❌ Firebase Admin SDK initialization error:', error);
        process.exit(1);
    }
}

const db = admin.firestore();

// --- Sample Product Data (Expand this!) ---
// Prices are in KES (Kenyan Shillings).
// Increased number of products per category
const sampleProducts: Omit<Product, 'id'>[] = [
    // == Strollers (Target: 50) ==
    { name: "Cosmic Cruiser Stroller", description: "Smooth ride across any terrain, folds compactly.", price: 18500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller1/400/300", stock: 15 },
    { name: "Galaxy Glide Lightweight Stroller", description: "Perfect for travel, easy to maneuver.", price: 12000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller2/400/300", stock: 25 },
    { name: "Nebula Navigator Jogging Stroller", description: "For active parents, all-terrain wheels.", price: 25000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller3/400/300", stock: 8 },
    { name: "Astra Twin Stroller", description: "Side-by-side comfort for two little stars.", price: 32000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller4/400/300", stock: 5 },
    { name: "Orbit Wanderer Travel System", description: "Includes stroller and infant car seat.", price: 29500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller5/400/300", stock: 10 },
    { name: "Meteor Compact Fold Stroller", description: "Ultra-compact fold for easy storage.", price: 14000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller6/400/300", stock: 20 },
    { name: "Supernova All-Weather Stroller", description: "Includes rain cover and footmuff.", price: 21000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller7/400/300", stock: 12 },
    { name: "Pulsar Reversible Seat Stroller", description: "Parent-facing or world-facing options.", price: 19800, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller8/400/300", stock: 18 },
    { name: "Quasar City Mini Stroller", description: "Lightweight and agile for urban environments.", price: 16500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller9/400/300", stock: 22 },
    { name: "Zenith Luxury Stroller", description: "Premium materials and enhanced suspension.", price: 35000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller10/400/300", stock: 7 },
    // ... (Add 40 more stroller variations)
    { name: "StarHopper Infant Car Seat", description: "Rear-facing safety for newborns.", price: 9500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat1/400/300", stock: 30 },
    { name: "Orbit Shield Convertible Car Seat", description: "Grows with your child, forward & rear-facing.", price: 15500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat2/400/300", stock: 18 },
    { name: "Comet Booster Seat", description: "High-back booster for older kids.", price: 7000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat3/400/300", stock: 22 },
    { name: "AstroSafe 360 Rotating Car Seat", description: "Easily rotate seat for access.", price: 24000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat4/400/300", stock: 10 },
    { name: "Rocket Infant Carrier", description: "Lightweight carrier with base.", price: 11000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat5/400/300", stock: 25 },
    { name: "Galaxy Guardian All-in-One Car Seat", description: "From infant to booster.", price: 21500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat6/400/300", stock: 15 },
    { name: "Nebula Backless Booster", description: "Portable booster for older children.", price: 4500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat7/400/300", stock: 35 },
    { name: "Starlight Isofix Base", description: "Secure Isofix installation for compatible seats.", price: 8000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat8/400/300", stock: 12 },
    { name: "Cosmic Comfort Convertible Seat", description: "Extra padding for long journeys.", price: 17000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat9/400/300", stock: 16 },
    { name: "Voyager Travel Car Seat", description: "Lightweight and airline-approved.", price: 13500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat10/400/300", stock: 20 },
    // ... (Add 40 more car seat variations)

    // == Cribs (Target: 50) ==
    { name: "Lunar Landing Crib", description: "Modern design, converts to toddler bed.", price: 28000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib1/400/300", stock: 12 },
    { name: "Dream Weaver Mini Crib", description: "Space-saving design for smaller nurseries.", price: 19000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib2/400/300", stock: 10 },
    { name: "Starlight Portable Crib", description: "Easy to set up for travel or visits.", price: 11500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib3/400/300", stock: 15 },
    { name: "Celestial Convertible Crib", description: "4-in-1 crib (crib, toddler, daybed, full bed).", price: 34000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib4/400/300", stock: 8 },
    { name: "Galaxy Glider Crib with Drawer", description: "Includes under-crib storage drawer.", price: 31000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib5/400/300", stock: 9 },
    { name: "Orbit Oval Crib", description: "Unique oval shape, stylish design.", price: 36500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib6/400/300", stock: 6 },
    { name: "Astra Bassinet & Bedside Sleeper", description: "Keeps baby close during early months.", price: 16000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib7/400/300", stock: 14 },
    { name: "Nebula Natural Wood Crib", description: "Solid wood construction, eco-friendly.", price: 29500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib8/400/300", stock: 11 },
    { name: "Cosmic Canopy Crib", description: "Elegant crib with canopy frame.", price: 39000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib9/400/300", stock: 5 },
    { name: "StarDust Travel Cot", description: "Lightweight cot with changing station.", price: 14500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib10/400/300", stock: 18 },
    // ... (Add 40 more crib variations)

    // == Baby Monitors (Target: 50) ==
    { name: "Guardian Angel Video Monitor", description: "HD video and two-way audio.", price: 13000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor1/400/300", stock: 40 },
    { name: "Echo Base Audio Monitor", description: "Clear sound, long range.", price: 4500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor2/400/300", stock: 50 },
    { name: "Smart Sight Monitor with App", description: "Connects to your phone, tracks vitals.", price: 22000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor3/400/300", stock: 10 },
    { name: "Astra View Dual Camera Monitor", description: "Monitor two rooms or angles.", price: 18500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor4/400/300", stock: 15 },
    { name: "Galaxy Sound Soother Monitor", description: "Includes nightlight and lullabies.", price: 9500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor5/400/300", stock: 25 },
    { name: "Orbit Wearable Movement Monitor", description: "Tracks baby's breathing movements.", price: 16000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor6/400/300", stock: 12 },
    { name: "Nebula Long Range Audio Monitor", description: "Extended range for larger homes.", price: 6000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor7/400/300", stock: 30 },
    { name: "Cosmic Connect Wi-Fi Monitor", description: "Access video feed from anywhere via Wi-Fi.", price: 15500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor8/400/300", stock: 20 },
    { name: "Starlight Simple Audio Monitor", description: "Basic, reliable audio monitoring.", price: 3800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor9/400/300", stock: 45 },
    { name: "Zenith Pro Video Monitor System", description: "Pan/tilt/zoom camera, temperature sensor.", price: 25000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor10/400/300", stock: 8 },
    // ... (Add 40 more monitor variations)

    // == Feeding (Target: 50) ==
    { name: "Rocket High Chair", description: "Adjustable height, easy to clean.", price: 8500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding1/400/300", stock: 28 },
    { name: "Galaxy Bottle Warmer", description: "Warms milk quickly and evenly.", price: 3500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding2/400/300", stock: 35 },
    { name: "Space Spoons (Set of 5)", description: "Soft-tip spoons for first solids.", price: 800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding3/400/300", stock: 100 },
    { name: "Nebula Bib Set (3 pack)", description: "Waterproof and easy wipe.", price: 1200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding4/400/300", stock: 80 },
    { name: "AstraGrow Convertible High Chair", description: "Converts to booster and toddler chair.", price: 14500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding5/400/300", stock: 20 },
    { name: "Orbit Steam Sterilizer & Dryer", description: "Sterilizes bottles and accessories.", price: 6500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding6/400/300", stock: 15 },
    { name: "Cosmic Silicone Plate Set", description: "Suction base plate and utensils.", price: 1800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding7/400/300", stock: 50 },
    { name: "Starlight Nursing Pillow", description: "Provides support for feeding.", price: 4200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding8/400/300", stock: 30 },
    { name: "Galaxy Formula Mixer Pitcher", description: "Mixes formula easily without clumps.", price: 2500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding9/400/300", stock: 40 },
    { name: "Lunar Snack Catcher Cups (2 pack)", description: "Spill-proof snack containers.", price: 1000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding10/400/300", stock: 70 },
    // ... (Add 40 more feeding variations)

     // == Clothing (Target: 50) ==
    { name: "Star Explorer Onesie (3-pack)", description: "Soft cotton, size 0-3 months.", price: 2500, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing1/400/300", stock: 60 },
    { name: "Moon Walker Pajamas (Size 1T)", description: "Cozy fleece for chilly nights.", price: 1800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing2/400/300", stock: 45 },
    { name: "Little Dipper Sun Hat", description: "UPF 50+ protection.", price: 950, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing3/400/300", stock: 70 },
    { name: "Cosmic Cloud Sleep Sack (0-6M)", description: "Wearable blanket for safe sleep.", price: 2800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing4/400/300", stock: 50 },
    { name: "Galaxy Romper Set (2 pack, 6-9M)", description: "Cute and comfortable rompers.", price: 2200, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing5/400/300", stock: 55 },
    { name: "Nebula Knit Cardigan (12-18M)", description: "Stylish layer for cooler days.", price: 2000, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing6/400/300", stock: 40 },
    { name: "Astra Adventure Leggings (3 pack, 2T)", description: "Stretchy and durable leggings.", price: 1900, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing7/400/300", stock: 65 },
    { name: "Orbit Organic Cotton Bodysuit Set (5 pack, NB)", description: "Gentle on newborn skin.", price: 3000, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing8/400/300", stock: 58 },
    { name: "Starlight Socks & Booties Set", description: "Keep little feet warm.", price: 700, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing9/400/300", stock: 90 },
    { name: "Rocket Rain Jacket (3T)", description: "Waterproof jacket for puddle jumping.", price: 3500, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing10/400/300", stock: 35 },
    // ... (Add 40 more clothing variations)

     // == Toys (Target: 50) ==
    { name: "Planet Plushie Rattle", description: "Soft textures and gentle rattle sound.", price: 750, category: "Toys", imageUrl: "https://picsum.photos/seed/toy1/400/300", stock: 90 },
    { name: "Cosmic Activity Gym", description: "Engaging mat with hanging toys.", price: 6500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy2/400/300", stock: 20 },
    { name: "Building Blocks Universe Set", description: "Wooden blocks for creative play.", price: 3200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy3/400/300", stock: 30 },
    { name: "Galaxy Glow Star Projector", description: "Projects stars onto ceiling, plays music.", price: 2900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy4/400/300", stock: 25 },
    { name: "Nebula Sensory Ball Pit", description: "Includes soft balls for sensory play.", price: 7500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy5/400/300", stock: 15 },
    { name: "Astra Stacking Rings", description: "Classic stacking toy for coordination.", price: 1200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy6/400/300", stock: 60 },
    { name: "Orbit Soft Cloth Book Set", description: "Crinkle books for early learning.", price: 1500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy7/400/300", stock: 50 },
    { name: "Starlight Musical Mobile", description: "Crib mobile with soothing melodies.", price: 4800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy8/400/300", stock: 18 },
    { name: "Rocket Ride-On Toy", description: "Fun ride-on for toddlers.", price: 5500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy9/400/300", stock: 22 },
    { name: "Comet Bath Toy Set", description: "Floating toys for bath time fun.", price: 900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy10/400/300", stock: 75 },
    // ... (Add 40 more toy variations)
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
    // console.warn("\n🚨 WARNING: Clearing existing data in 5 seconds! Press Ctrl+C to cancel.\n");
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

        if (count % BATCH_SIZE === 0) {
            const batchNum = Math.ceil(count / BATCH_SIZE);
            console.log(`   Committing batch ${batchNum} (${BATCH_SIZE} products)...`);
            await batch.commit();
            batch = db.batch(); // Start a new batch
        }
    }

    // Commit any remaining items in the last batch
    const remaining = count % BATCH_SIZE;
    if (remaining !== 0) {
        console.log(`   Committing final batch (${remaining} products)...`);
        await batch.commit();
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2); // Duration in seconds

    console.log(`\n✅ Seeding complete! Added ${count} products to '${COLLECTION_NAME}' in ${duration} seconds.`);
}

// --- Run the Seeding Process ---
seedData().catch((error) => {
    console.error('\n❌ Error during Firestore seeding:', error);
    process.exit(1);
});

