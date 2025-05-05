
/**
 * Firestore Seeding Script
 *
 * How to run:
 * 1.  Ensure you have a `.env.local` file in your project root with your
 *     Firebase configuration variables (e.g., NEXT_PUBLIC_FIREBASE_PROJECT_ID).
 * 2.  Get Service Account Credentials:
 *     - Go to your Firebase Project Settings > Service accounts.
 *     - Click "Generate new private key" and download the JSON file.
 *     - **IMPORTANT:** Open the downloaded JSON file, copy its entire content.
 *     - Paste the copied JSON content into the `SERVICE_ACCOUNT_KEY_JSON` variable in your `.env.local` file,
 *       replacing the placeholder `'PASTE_YOUR_SERVICE_ACCOUNT_KEY_JSON_CONTENT_HERE'`.
 *       Ensure the pasted content is enclosed in single quotes (`'...'`).
 *       **CRITICAL for `.env.local`:** Inside the pasted JSON string, find the `private_key` field.
 *       Replace **all** newline characters (`\n`) *within the private_key string value* with the literal string `\\n`.
 *       Example: `"-----BEGIN PRIVATE KEY-----\nABC\nXYZ\n-----END PRIVATE KEY-----\n"`
 *       becomes `"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDXP1dwqxmbE0CR\\n6PABN4DSNhrJCZdNvQvqDyDX/U+bbOuSahZMRv5dwxpANfpm6jf/Mlrxz0l7Spbc\\nNeW75A2oqJMYh6BKbX+Wxu4SexDTTMfMUJZF1Uc2pKov3MNHzbwyTl27ww23RE71\\nhC1czZBmtySZdj5vHyW7nH1Mv+D2iLXC7vQF+6UgHquF2YjppLf5ebCNDPlar6gI\\nfS/3UEuY8W/1JCTxd3naLMGnAEJaRs22vd+YFHyj4aeKVq8o5ZYDFKcFA8nPPm/T\\neVQWRv7ZHWoLIyMg3OmaPnVjJ8IGJYJt+gaKb1RmWVLJdsv5dZ9NCIGUE0daz+TS\\nf8USi/0tAgMBAAECggEAJbeB7ypwG3IRba/bRF9RKaSU53bQhizy5kHd37MRrLq2\\ngaqouxdykYPzON6sgLWYd9V/RaFsrxe4HSCtn5Gbyhq14cW8MuaCha1YgLEDVv88\\ngGL7ngN8DclnT+k3Z8DXcho0xwasA9nKmy9c0obrv2/mkCR91rNmxXvrodP6i8BB\\nEnBUBeKb1nVihEOaUljDd/wEJv1qjwWY+UJn7crgTAVYeqnamU+U4ldmByAnQ9+B\\nJl+1Kf5z5e0avbN/VdxDCA1SzbLY1waocvUhQpfjuGnlJtunWyxpBeC//Hlj2cq0\\nm2rDnD5p3x2D+GEgP6L/Bt0KaLzum49GSAs/IoVk8QKBgQDsjeQs0zFSAh+8/ioD\\niaMeHkERTxMgmJgsr7mI4fJcU9xhTH76joJfYLM5QgM+ZfgfBZa/yvqfTrg6sB1P\\njE02r09h6sYuL430LC0LQjhBySEsv4q4XBTBc0sWzyA3AKpohPKqpszBLMVdfF2R\\n5EZ6TeHTHnW+xRTqJaQ5gEwB8QKBgQDo8RBRkWVuFXg4MomJ2IRT27v3M7so1ALl\\nGW8wMZ8MdVvYwALkwK6Cobp8CdSvdzUsgG+frUastcsp7IbCuJ7AGkEBx3AX/A7Q\\nUT36pN9X8WzrmtaDZPrj0GT63uD8mkDZEfdKhfTXryOokrtwpguwwCx0Z2V4vxAl\\nKbdu4t0y/QKBgQCFd7WDORG91Kb1qm4oGtNnHejWjEgdfxt1Mxy6x8lIIKTaXR/T\\n3O5gRB47MyzDWyM41Z1tz2fC1NaLfmy7Qk0aiqV+eMmiq4ArgXVUweMd8w59wgDR\\n7lpjn9qBHxJtFjoPyNtmP8CNSeZ9zbq5oxPE1AaTaL9EiMw5JE3Zh7La8QKBgQC1\\nsQHXfZ8t5FUnEFQzTsy4VBYi1RjQ2b2AUPxnDO1P3GJNiEc5ggkcH2XDxi88xbCW\\nC4AFfjQ4FnxnMPRUAYjhshiueI84RgSP/C5pyBvlDoy0oMtdJXCELVH2U84NeYvH\\nRLosSJwXd6ZKoFjPntRTgzGpgdSl//Fp60YGmbGLSQKBgEkDZ4DzCglyG7sxxcCd\\nUJaMMC5C77Yp0KwtgAy7kNwrmmcVQMy4He+u42sfzXxbMj+/wJdrooorlbQAmRWz\\nBuTt65UX/Au47HOqdO6jQnl/02dGnqDV6CRNOLR86foSN9Fh7W6yiPPpwLz6yO5R\\nNKgQTElNUIsmMTgOxgnRuhjE\\n-----END PRIVATE KEY-----\\n"`
 * 3.  Install Dependencies:
 *     - Run `npm install` or `yarn install` in your project root if you haven't already (to install `firebase-admin`, `tsx`, `dotenv-cli`).
 * 4.  Run the Script:
 *     - Open your terminal in the project root.
 *     - Execute the script using: `npm run seed:firestore`
 *       (The `dotenv-cli` package in the script command automatically loads variables from `.env.local`)
 *
 * This script will:
 * - Connect to your Firestore database using Admin privileges derived from the SERVICE_ACCOUNT_KEY_JSON.
 * - Add sample product data using batch writes.
 * - **By default, it DOES NOT clear existing data.** Uncomment the `clearCollection` line if you want to wipe the collection first.
 */
// `dotenv-cli` in package.json's script handles loading .env.local
import path from 'path';
import admin from 'firebase-admin';
import type { Product } from '@/types/product'; // Adjust path if necessary


// --- Configuration ---
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID; // Get Project ID from env loaded by dotenv-cli
const SERVICE_ACCOUNT_JSON_STRING = process.env.SERVICE_ACCOUNT_KEY_JSON;
const COLLECTION_NAME = 'products';
const BATCH_SIZE = 100; // Firestore batch write limit is 500 operations

// --- Environment Variable Validation ---
if (!PROJECT_ID || PROJECT_ID === "YOUR_PROJECT_ID_HERE") {
  const errorMessage =
    `❌ Configuration Error:\\n` +
    ` Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable not set or still has the placeholder value. ` +
    `Please ensure it is set correctly in your .env.local file and you have replaced "YOUR_PROJECT_ID_HERE" with your actual Firebase Project ID. Remember to restart your terminal or source your profile if you set it globally. \\n`;
  console.error(errorMessage);
  process.exit(1); // Exit if the crucial Project ID is missing or is the placeholder
}


// --- Initialize Firebase Admin SDK ---
try {
    // Check if SERVICE_ACCOUNT_KEY_JSON is set and not the placeholder
    if (!SERVICE_ACCOUNT_JSON_STRING || SERVICE_ACCOUNT_JSON_STRING.includes('PASTE_YOUR_SERVICE_ACCOUNT_KEY_JSON_CONTENT_HERE')) {
        console.error("\\n❌ Configuration Error:");
        console.error("SERVICE_ACCOUNT_KEY_JSON environment variable is not set or is still the placeholder in your .env.local file.");
        console.error("Please open your downloaded serviceAccountKey.json file, copy its content,");
        console.error("and paste it between the single quotes for SERVICE_ACCOUNT_KEY_JSON in .env.local.");
        console.error(">>> IMPORTANT: Ensure newline characters ('\\n') within the 'private_key' field are replaced with the literal string '\\\\n'. <<<");
        process.exit(1);
    }

    let serviceAccount;
    try {
        // Attempt to parse the JSON string from the environment variable
        // This relies on the JSON string being correctly escaped in .env.local, especially newlines in private_key (\\n -> \\\\n)
        serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON_STRING);
    } catch (parseError) {
        console.error("\\n❌ Configuration Error:");
        console.error("Failed to parse the SERVICE_ACCOUNT_KEY_JSON value from .env.local.");
        console.error("Please ensure the content pasted from your serviceAccountKey.json file is valid JSON, enclosed in single quotes (')");
        console.error("AND that all newline characters ('\\n') within the 'private_key' value have been replaced with the literal string '\\\\n'.");
        console.error("Example: \\"private_key\\": \\"-----BEGIN PRIVATE KEY-----\\nMIIEvg...\\n...\\n-----END PRIVATE KEY-----\\n\\"");
        console.error("Must become: \\"private_key\\": \\"-----BEGIN PRIVATE KEY-----\\\\nMIIEvg...\\\\n...\\\\n-----END PRIVATE KEY-----\\\\n\\"");
        console.error("Parsing Error:", parseError, "\\n");
        process.exit(1);
    }

    // Check if already initialized to avoid duplicate app error
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: PROJECT_ID, // Use the validated PROJECT_ID
         });
         console.log(`🔑 Firebase Admin SDK initialized for project: ${PROJECT_ID} using credentials from .env.local`);
    } else {
        console.log('ℹ️ Firebase Admin SDK already initialized.');
    }


} catch (error: any) {
    // Catch potential errors during initializeApp if parsing succeeded but credentials are bad
    console.error('❌ Firebase Admin SDK initialization error:', error);
    process.exit(1);
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
    { name: "Stellar Basic Stroller", description: "Affordable and reliable everyday stroller.", price: 9500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller11/400/300", stock: 30 },
    { name: "Comet Tandem Stroller", description: "Inline seating for two children.", price: 34000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller12/400/300", stock: 4 },
    { name: "Andromeda Umbrella Stroller", description: "Extremely lightweight and simple fold.", price: 7000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller13/400/300", stock: 40 },
    { name: "Voyager 3-Wheel Stroller", description: "Sporty design with enhanced maneuverability.", price: 23000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller14/400/300", stock: 9 },
    { name: "Nova Bassinet Stroller Combo", description: "Includes detachable bassinet for newborns.", price: 27500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller15/400/300", stock: 11 },
     // ...(Continue adding 35 more unique stroller entries)
    { name: "Stroller 16", description: "Description for Stroller 16", price: 17000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller16/400/300", stock: 15 },
    { name: "Stroller 17", description: "Description for Stroller 17", price: 22000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller17/400/300", stock: 10 },
    { name: "Stroller 18", description: "Description for Stroller 18", price: 11000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller18/400/300", stock: 28 },
    { name: "Stroller 19", description: "Description for Stroller 19", price: 31000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller19/400/300", stock: 6 },
    { name: "Stroller 20", description: "Description for Stroller 20", price: 15500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller20/400/300", stock: 23 },
    { name: "Stroller 21", description: "Description for Stroller 21", price: 26000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller21/400/300", stock: 9 },
    { name: "Stroller 22", description: "Description for Stroller 22", price: 19000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller22/400/300", stock: 17 },
    { name: "Stroller 23", description: "Description for Stroller 23", price: 8000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller23/400/300", stock: 35 },
    { name: "Stroller 24", description: "Description for Stroller 24", price: 24500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller24/400/300", stock: 11 },
    { name: "Stroller 25", description: "Description for Stroller 25", price: 28500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller25/400/300", stock: 8 },
    { name: "Stroller 26", description: "Description for Stroller 26", price: 13000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller26/400/300", stock: 26 },
    { name: "Stroller 27", description: "Description for Stroller 27", price: 20500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller27/400/300", stock: 13 },
    { name: "Stroller 28", description: "Description for Stroller 28", price: 33000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller28/400/300", stock: 5 },
    { name: "Stroller 29", description: "Description for Stroller 29", price: 10000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller29/400/300", stock: 32 },
    { name: "Stroller 30", description: "Description for Stroller 30", price: 17500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller30/400/300", stock: 19 },
    { name: "Stroller 31", description: "Description for Stroller 31", price: 21500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller31/400/300", stock: 14 },
    { name: "Stroller 32", description: "Description for Stroller 32", price: 14800, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller32/400/300", stock: 21 },
    { name: "Stroller 33", description: "Description for Stroller 33", price: 30000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller33/400/300", stock: 7 },
    { name: "Stroller 34", description: "Description for Stroller 34", price: 23500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller34/400/300", stock: 10 },
    { name: "Stroller 35", description: "Description for Stroller 35", price: 16000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller35/400/300", stock: 24 },
    { name: "Stroller 36", description: "Description for Stroller 36", price: 11500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller36/400/300", stock: 29 },
    { name: "Stroller 37", description: "Description for Stroller 37", price: 27000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller37/400/300", stock: 9 },
    { name: "Stroller 38", description: "Description for Stroller 38", price: 19500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller38/400/300", stock: 16 },
    { name: "Stroller 39", description: "Description for Stroller 39", price: 12500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller39/400/300", stock: 27 },
    { name: "Stroller 40", description: "Description for Stroller 40", price: 36000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller40/400/300", stock: 4 },
    { name: "Stroller 41", description: "Description for Stroller 41", price: 18000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller41/400/300", stock: 17 },
    { name: "Stroller 42", description: "Description for Stroller 42", price: 22500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller42/400/300", stock: 12 },
    { name: "Stroller 43", description: "Description for Stroller 43", price: 10500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller43/400/300", stock: 31 },
    { name: "Stroller 44", description: "Description for Stroller 44", price: 29000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller44/400/300", stock: 7 },
    { name: "Stroller 45", description: "Description for Stroller 45", price: 15000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller45/400/300", stock: 25 },
    { name: "Stroller 46", description: "Description for Stroller 46", price: 20000, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller46/400/300", stock: 15 },
    { name: "Stroller 47", description: "Description for Stroller 47", price: 31500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller47/400/300", stock: 6 },
    { name: "Stroller 48", description: "Description for Stroller 48", price: 8500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller48/400/300", stock: 38 },
    { name: "Stroller 49", description: "Description for Stroller 49", price: 25500, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller49/400/300", stock: 10 },
    { name: "Stroller 50", description: "Description for Stroller 50", price: 18800, category: "Strollers", imageUrl: "https://picsum.photos/seed/stroller50/400/300", stock: 18 },


    // == Car Seats (Target: 50) ==
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
    { name: "Pulsar SlimFit Car Seat", description: "Space-saving design for fitting multiple seats.", price: 19000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat11/400/300", stock: 14 },
    { name: "Quasar Extended Rear-Facing Seat", description: "Allows rear-facing for longer.", price: 18000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat12/400/300", stock: 11 },
    { name: "Zenith Pro Booster with Latch", description: "High-back booster with secure Latch system.", price: 9000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat13/400/300", stock: 19 },
    { name: "Meteor Infant Capsule", description: "Lightweight capsule compatible with travel systems.", price: 12500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat14/400/300", stock: 28 },
    { name: "Supernova SecureRide Convertible", description: "Enhanced side-impact protection.", price: 20500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat15/400/300", stock: 13 },
     // ...(Continue adding 35 more unique car seat entries)
    { name: "Car Seat 16", description: "Description for Car Seat 16", price: 16000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat16/400/300", stock: 17 },
    { name: "Car Seat 17", description: "Description for Car Seat 17", price: 23000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat17/400/300", stock: 9 },
    { name: "Car Seat 18", description: "Description for Car Seat 18", price: 10000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat18/400/300", stock: 27 },
    { name: "Car Seat 19", description: "Description for Car Seat 19", price: 14500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat19/400/300", stock: 21 },
    { name: "Car Seat 20", description: "Description for Car Seat 20", price: 25000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat20/400/300", stock: 8 },
    { name: "Car Seat 21", description: "Description for Car Seat 21", price: 19500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat21/400/300", stock: 13 },
    { name: "Car Seat 22", description: "Description for Car Seat 22", price: 8500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat22/400/300", stock: 20 },
    { name: "Car Seat 23", description: "Description for Car Seat 23", price: 11500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat23/400/300", stock: 24 },
    { name: "Car Seat 24", description: "Description for Car Seat 24", price: 22500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat24/400/300", stock: 12 },
    { name: "Car Seat 25", description: "Description for Car Seat 25", price: 17500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat25/400/300", stock: 15 },
    { name: "Car Seat 26", description: "Description for Car Seat 26", price: 6000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat26/400/300", stock: 32 },
    { name: "Car Seat 27", description: "Description for Car Seat 27", price: 13000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat27/400/300", stock: 23 },
    { name: "Car Seat 28", description: "Description for Car Seat 28", price: 20000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat28/400/300", stock: 11 },
    { name: "Car Seat 29", description: "Description for Car Seat 29", price: 16500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat29/400/300", stock: 18 },
    { name: "Car Seat 30", description: "Description for Car Seat 30", price: 9800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat30/400/300", stock: 26 },
    { name: "Car Seat 31", description: "Description for Car Seat 31", price: 18500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat31/400/300", stock: 14 },
    { name: "Car Seat 32", description: "Description for Car Seat 32", price: 12000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat32/400/300", stock: 25 },
    { name: "Car Seat 33", description: "Description for Car Seat 33", price: 26000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat33/400/300", stock: 7 },
    { name: "Car Seat 34", description: "Description for Car Seat 34", price: 15000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat34/400/300", stock: 19 },
    { name: "Car Seat 35", description: "Description for Car Seat 35", price: 21000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat35/400/300", stock: 10 },
    { name: "Car Seat 36", description: "Description for Car Seat 36", price: 7500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat36/400/300", stock: 30 },
    { name: "Car Seat 37", description: "Description for Car Seat 37", price: 14000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat37/400/300", stock: 22 },
    { name: "Car Seat 38", description: "Description for Car Seat 38", price: 17800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat38/400/300", stock: 16 },
    { name: "Car Seat 39", description: "Description for Car Seat 39", price: 10500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat39/400/300", stock: 29 },
    { name: "Car Seat 40", description: "Description for Car Seat 40", price: 27000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat40/400/300", stock: 6 },
    { name: "Car Seat 41", description: "Description for Car Seat 41", price: 19800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat41/400/300", stock: 13 },
    { name: "Car Seat 42", description: "Description for Car Seat 42", price: 11800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat42/400/300", stock: 26 },
    { name: "Car Seat 43", description: "Description for Car Seat 43", price: 23500, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat43/400/300", stock: 9 },
    { name: "Car Seat 44", description: "Description for Car Seat 44", price: 15800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat44/400/300", stock: 18 },
    { name: "Car Seat 45", description: "Description for Car Seat 45", price: 9200, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat45/400/300", stock: 28 },
    { name: "Car Seat 46", description: "Description for Car Seat 46", price: 16800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat46/400/300", stock: 17 },
    { name: "Car Seat 47", description: "Description for Car Seat 47", price: 21800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat47/400/300", stock: 11 },
    { name: "Car Seat 48", description: "Description for Car Seat 48", price: 5000, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat48/400/300", stock: 38 },
    { name: "Car Seat 49", description: "Description for Car Seat 49", price: 13800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat49/400/300", stock: 23 },
    { name: "Car Seat 50", description: "Description for Car Seat 50", price: 20800, category: "Car Seats", imageUrl: "https://picsum.photos/seed/carseat50/400/300", stock: 10 },


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
    { name: "MoonBeam Rocking Bassinet", description: "Gentle rocking motion to soothe baby.", price: 17500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib11/400/300", stock: 13 },
    { name: "Horizon Modern Crib", description: "Sleek lines and minimalist aesthetic.", price: 32000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib12/400/300", stock: 7 },
    { name: "Twilight Folding Crib", description: "Folds flat for easy storage.", price: 22000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib13/400/300", stock: 9 },
    { name: "Aurora Round Crib", description: "Unique circular design statement piece.", price: 42000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib14/400/300", stock: 4 },
    { name: "Equinox Crib with Changing Table Combo", description: "Integrated changing table for convenience.", price: 37000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib15/400/300", stock: 10 },
    // ...(Continue adding 35 more unique crib entries)
    { name: "Crib 16", description: "Description for Crib 16", price: 26000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib16/400/300", stock: 13 },
    { name: "Crib 17", description: "Description for Crib 17", price: 18000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib17/400/300", stock: 11 },
    { name: "Crib 18", description: "Description for Crib 18", price: 30000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib18/400/300", stock: 8 },
    { name: "Crib 19", description: "Description for Crib 19", price: 21000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib19/400/300", stock: 14 },
    { name: "Crib 20", description: "Description for Crib 20", price: 35000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib20/400/300", stock: 7 },
    { name: "Crib 21", description: "Description for Crib 21", price: 17000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib21/400/300", stock: 16 },
    { name: "Crib 22", description: "Description for Crib 22", price: 23000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib22/400/300", stock: 10 },
    { name: "Crib 23", description: "Description for Crib 23", price: 12500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib23/400/300", stock: 19 },
    { name: "Crib 24", description: "Description for Crib 24", price: 40000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib24/400/300", stock: 5 },
    { name: "Crib 25", description: "Description for Crib 25", price: 27000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib25/400/300", stock: 9 },
    { name: "Crib 26", description: "Description for Crib 26", price: 19500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib26/400/300", stock: 12 },
    { name: "Crib 27", description: "Description for Crib 27", price: 33000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib27/400/300", stock: 7 },
    { name: "Crib 28", description: "Description for Crib 28", price: 15000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib28/400/300", stock: 17 },
    { name: "Crib 29", description: "Description for Crib 29", price: 24000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib29/400/300", stock: 10 },
    { name: "Crib 30", description: "Description for Crib 30", price: 38000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib30/400/300", stock: 6 },
    { name: "Crib 31", description: "Description for Crib 31", price: 10000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib31/400/300", stock: 20 },
    { name: "Crib 32", description: "Description for Crib 32", price: 29000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib32/400/300", stock: 9 },
    { name: "Crib 33", description: "Description for Crib 33", price: 20000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib33/400/300", stock: 11 },
    { name: "Crib 34", description: "Description for Crib 34", price: 31500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib34/400/300", stock: 8 },
    { name: "Crib 35", description: "Description for Crib 35", price: 13500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib35/400/300", stock: 18 },
    { name: "Crib 36", description: "Description for Crib 36", price: 25000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib36/400/300", stock: 10 },
    { name: "Crib 37", description: "Description for Crib 37", price: 16500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib37/400/300", stock: 15 },
    { name: "Crib 38", description: "Description for Crib 38", price: 41000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib38/400/300", stock: 4 },
    { name: "Crib 39", description: "Description for Crib 39", price: 22500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib39/400/300", stock: 9 },
    { name: "Crib 40", description: "Description for Crib 40", price: 36000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib40/400/300", stock: 6 },
    { name: "Crib 41", description: "Description for Crib 41", price: 18500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib41/400/300", stock: 12 },
    { name: "Crib 42", description: "Description for Crib 42", price: 28500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib42/400/300", stock: 9 },
    { name: "Crib 43", description: "Description for Crib 43", price: 11000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib43/400/300", stock: 20 },
    { name: "Crib 44", description: "Description for Crib 44", price: 39500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib44/400/300", stock: 5 },
    { name: "Crib 45", description: "Description for Crib 45", price: 15500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib45/400/300", stock: 16 },
    { name: "Crib 46", description: "Description for Crib 46", price: 26500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib46/400/300", stock: 10 },
    { name: "Crib 47", description: "Description for Crib 47", price: 19800, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib47/400/300", stock: 13 },
    { name: "Crib 48", description: "Description for Crib 48", price: 32500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib48/400/300", stock: 7 },
    { name: "Crib 49", description: "Description for Crib 49", price: 14000, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib49/400/300", stock: 17 },
    { name: "Crib 50", description: "Description for Crib 50", price: 21500, category: "Cribs", imageUrl: "https://picsum.photos/seed/crib50/400/300", stock: 11 },

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
    { name: "Satellite Split Screen Monitor", description: "View multiple cameras simultaneously.", price: 20000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor11/400/300", stock: 13 },
    { name: "Lunar Low Emission Audio Monitor", description: "Designed for minimal EMF emissions.", price: 7500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor12/400/300", stock: 28 },
    { name: "Comet Portable Video Monitor", description: "Compact monitor unit for easy carrying.", price: 14000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor13/400/300", stock: 18 },
    { name: "Pulsar Breathing Sensor Pad Monitor", description: "Under-mattress sensor pad detects movement.", price: 19500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor14/400/300", stock: 9 },
    { name: "Quasar Smart Sock Monitor", description: "Tracks heart rate and oxygen levels.", price: 32000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor15/400/300", stock: 7 },
    // ...(Continue adding 35 more unique monitor entries)
    { name: "Monitor 16", description: "Description for Monitor 16", price: 17000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor16/400/300", stock: 16 },
    { name: "Monitor 17", description: "Description for Monitor 17", price: 11000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor17/400/300", stock: 22 },
    { name: "Monitor 18", description: "Description for Monitor 18", price: 23000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor18/400/300", stock: 9 },
    { name: "Monitor 19", description: "Description for Monitor 19", price: 8000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor19/400/300", stock: 32 },
    { name: "Monitor 20", description: "Description for Monitor 20", price: 28000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor20/400/300", stock: 6 },
    { name: "Monitor 21", description: "Description for Monitor 21", price: 14500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor21/400/300", stock: 19 },
    { name: "Monitor 22", description: "Description for Monitor 22", price: 19000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor22/400/300", stock: 14 },
    { name: "Monitor 23", description: "Description for Monitor 23", price: 5000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor23/400/300", stock: 48 },
    { name: "Monitor 24", description: "Description for Monitor 24", price: 21000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor24/400/300", stock: 11 },
    { name: "Monitor 25", description: "Description for Monitor 25", price: 12000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor25/400/300", stock: 26 },
    { name: "Monitor 26", description: "Description for Monitor 26", price: 17500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor26/400/300", stock: 17 },
    { name: "Monitor 27", description: "Description for Monitor 27", price: 26000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor27/400/300", stock: 7 },
    { name: "Monitor 28", description: "Description for Monitor 28", price: 9000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor28/400/300", stock: 29 },
    { name: "Monitor 29", description: "Description for Monitor 29", price: 15000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor29/400/300", stock: 21 },
    { name: "Monitor 30", description: "Description for Monitor 30", price: 24000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor30/400/300", stock: 8 },
    { name: "Monitor 31", description: "Description for Monitor 31", price: 6500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor31/400/300", stock: 35 },
    { name: "Monitor 32", description: "Description for Monitor 32", price: 18000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor32/400/300", stock: 15 },
    { name: "Monitor 33", description: "Description for Monitor 33", price: 10500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor33/400/300", stock: 27 },
    { name: "Monitor 34", description: "Description for Monitor 34", price: 20500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor34/400/300", stock: 12 },
    { name: "Monitor 35", description: "Description for Monitor 35", price: 13500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor35/400/300", stock: 23 },
    { name: "Monitor 36", description: "Description for Monitor 36", price: 29000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor36/400/300", stock: 5 },
    { name: "Monitor 37", description: "Description for Monitor 37", price: 16500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor37/400/300", stock: 18 },
    { name: "Monitor 38", description: "Description for Monitor 38", price: 7000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor38/400/300", stock: 38 },
    { name: "Monitor 39", description: "Description for Monitor 39", price: 22500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor39/400/300", stock: 10 },
    { name: "Monitor 40", description: "Description for Monitor 40", price: 11500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor40/400/300", stock: 24 },
    { name: "Monitor 41", description: "Description for Monitor 41", price: 27000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor41/400/300", stock: 7 },
    { name: "Monitor 42", description: "Description for Monitor 42", price: 18800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor42/400/300", stock: 14 },
    { name: "Monitor 43", description: "Description for Monitor 43", price: 9800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor43/400/300", stock: 31 },
    { name: "Monitor 44", description: "Description for Monitor 44", price: 25500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor44/400/300", stock: 8 },
    { name: "Monitor 45", description: "Description for Monitor 45", price: 12800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor45/400/300", stock: 25 },
    { name: "Monitor 46", description: "Description for Monitor 46", price: 21500, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor46/400/300", stock: 11 },
    { name: "Monitor 47", description: "Description for Monitor 47", price: 15800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor47/400/300", stock: 20 },
    { name: "Monitor 48", description: "Description for Monitor 48", price: 4200, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor48/400/300", stock: 52 },
    { name: "Monitor 49", description: "Description for Monitor 49", price: 19800, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor49/400/300", stock: 13 },
    { name: "Monitor 50", description: "Description for Monitor 50", price: 30000, category: "Monitors", imageUrl: "https://picsum.photos/seed/monitor50/400/300", stock: 4 },


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
    { name: "Meteor Bottle Brush Set", description: "Includes various brushes for cleaning.", price: 950, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding11/400/300", stock: 65 },
    { name: "Supernova Baby Food Maker", description: "Steams and blends baby food.", price: 9800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding12/400/300", stock: 12 },
    { name: "Pulsar Sippy Cup Set (3 stages)", description: "Transition cups for different ages.", price: 1500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding13/400/300", stock: 55 },
    { name: "Quasar Breast Pump (Electric)", description: "Double electric breast pump.", price: 15000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding14/400/300", stock: 10 },
    { name: "Zenith Portable High Chair", description: "Clamps onto tables for on-the-go feeding.", price: 6000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding15/400/300", stock: 25 },
    // ...(Continue adding 35 more unique feeding entries)
    { name: "Feeding Item 16", description: "Description for Feeding Item 16", price: 2200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding16/400/300", stock: 45 },
    { name: "Feeding Item 17", description: "Description for Feeding Item 17", price: 500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding17/400/300", stock: 120 },
    { name: "Feeding Item 18", description: "Description for Feeding Item 18", price: 7200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding18/400/300", stock: 18 },
    { name: "Feeding Item 19", description: "Description for Feeding Item 19", price: 3000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding19/400/300", stock: 38 },
    { name: "Feeding Item 20", description: "Description for Feeding Item 20", price: 11000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding20/400/300", stock: 14 },
    { name: "Feeding Item 21", description: "Description for Feeding Item 21", price: 1300, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding21/400/300", stock: 60 },
    { name: "Feeding Item 22", description: "Description for Feeding Item 22", price: 4800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding22/400/300", stock: 26 },
    { name: "Feeding Item 23", description: "Description for Feeding Item 23", price: 1600, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding23/400/300", stock: 52 },
    { name: "Feeding Item 24", description: "Description for Feeding Item 24", price: 8800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding24/400/300", stock: 16 },
    { name: "Feeding Item 25", description: "Description for Feeding Item 25", price: 2000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding25/400/300", stock: 48 },
    { name: "Feeding Item 26", description: "Description for Feeding Item 26", price: 5500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding26/400/300", stock: 22 },
    { name: "Feeding Item 27", description: "Description for Feeding Item 27", price: 900, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding27/400/300", stock: 90 },
    { name: "Feeding Item 28", description: "Description for Feeding Item 28", price: 12500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding28/400/300", stock: 11 },
    { name: "Feeding Item 29", description: "Description for Feeding Item 29", price: 3800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding29/400/300", stock: 33 },
    { name: "Feeding Item 30", description: "Description for Feeding Item 30", price: 1700, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding30/400/300", stock: 50 },
    { name: "Feeding Item 31", description: "Description for Feeding Item 31", price: 6800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding31/400/300", stock: 19 },
    { name: "Feeding Item 32", description: "Description for Feeding Item 32", price: 2800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding32/400/300", stock: 40 },
    { name: "Feeding Item 33", description: "Description for Feeding Item 33", price: 10500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding33/400/300", stock: 13 },
    { name: "Feeding Item 34", description: "Description for Feeding Item 34", price: 4000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding34/400/300", stock: 31 },
    { name: "Feeding Item 35", description: "Description for Feeding Item 35", price: 1900, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding35/400/300", stock: 49 },
    { name: "Feeding Item 36", description: "Description for Feeding Item 36", price: 8000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding36/400/300", stock: 17 },
    { name: "Feeding Item 37", description: "Description for Feeding Item 37", price: 1100, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding37/400/300", stock: 75 },
    { name: "Feeding Item 38", description: "Description for Feeding Item 38", price: 5200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding38/400/300", stock: 24 },
    { name: "Feeding Item 39", description: "Description for Feeding Item 39", price: 3300, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding39/400/300", stock: 36 },
    { name: "Feeding Item 40", description: "Description for Feeding Item 40", price: 13800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding40/400/300", stock: 10 },
    { name: "Feeding Item 41", description: "Description for Feeding Item 41", price: 750, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding41/400/300", stock: 110 },
    { name: "Feeding Item 42", description: "Description for Feeding Item 42", price: 9500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding42/400/300", stock: 15 },
    { name: "Feeding Item 43", description: "Description for Feeding Item 43", price: 2400, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding43/400/300", stock: 42 },
    { name: "Feeding Item 44", description: "Description for Feeding Item 44", price: 6200, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding44/400/300", stock: 21 },
    { name: "Feeding Item 45", description: "Description for Feeding Item 45", price: 1400, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding45/400/300", stock: 58 },
    { name: "Feeding Item 46", description: "Description for Feeding Item 46", price: 4500, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding46/400/300", stock: 29 },
    { name: "Feeding Item 47", description: "Description for Feeding Item 47", price: 10000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding47/400/300", stock: 12 },
    { name: "Feeding Item 48", description: "Description for Feeding Item 48", price: 2100, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding48/400/300", stock: 46 },
    { name: "Feeding Item 49", description: "Description for Feeding Item 49", price: 7800, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding49/400/300", stock: 18 },
    { name: "Feeding Item 50", description: "Description for Feeding Item 50", price: 12000, category: "Feeding", imageUrl: "https://picsum.photos/seed/feeding50/400/300", stock: 11 },

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
    { name: "Comet Cotton T-Shirt Set (4 pack, 18M)", description: "Everyday essential t-shirts.", price: 1600, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing11/400/300", stock: 75 },
    { name: "Andromeda Denim Overalls (2T)", description: "Classic and durable overalls.", price: 2400, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing12/400/300", stock: 42 },
    { name: "Voyager Fleece Lined Snowsuit (12M)", description: "Warm suit for winter weather.", price: 4500, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing13/400/300", stock: 25 },
    { name: "Nova Party Dress (3T)", description: "Sparkly dress for special occasions.", price: 2900, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing14/400/300", stock: 30 },
    { name: "Stellar Swimsuit Set (2T)", description: "Includes rash guard and swim trunks.", price: 2100, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing15/400/300", stock: 50 },
    // ...(Continue adding 35 more unique clothing entries)
    { name: "Clothing Item 16", description: "Description for Clothing Item 16", price: 1500, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing16/400/300", stock: 80 },
    { name: "Clothing Item 17", description: "Description for Clothing Item 17", price: 3200, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing17/400/300", stock: 38 },
    { name: "Clothing Item 18", description: "Description for Clothing Item 18", price: 1100, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing18/400/300", stock: 68 },
    { name: "Clothing Item 19", description: "Description for Clothing Item 19", price: 2600, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing19/400/300", stock: 44 },
    { name: "Clothing Item 20", description: "Description for Clothing Item 20", price: 1700, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing20/400/300", stock: 52 },
    { name: "Clothing Item 21", description: "Description for Clothing Item 21", price: 4000, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing21/400/300", stock: 28 },
    { name: "Clothing Item 22", description: "Description for Clothing Item 22", price: 800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing22/400/300", stock: 100 },
    { name: "Clothing Item 23", description: "Description for Clothing Item 23", price: 2300, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing23/400/300", stock: 48 },
    { name: "Clothing Item 24", description: "Description for Clothing Item 24", price: 3800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing24/400/300", stock: 32 },
    { name: "Clothing Item 25", description: "Description for Clothing Item 25", price: 1400, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing25/400/300", stock: 62 },
    { name: "Clothing Item 26", description: "Description for Clothing Item 26", price: 2700, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing26/400/300", stock: 40 },
    { name: "Clothing Item 27", description: "Description for Clothing Item 27", price: 1950, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing27/400/300", stock: 56 },
    { name: "Clothing Item 28", description: "Description for Clothing Item 28", price: 3100, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing28/400/300", stock: 36 },
    { name: "Clothing Item 29", description: "Description for Clothing Item 29", price: 1000, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing29/400/300", stock: 85 },
    { name: "Clothing Item 30", description: "Description for Clothing Item 30", price: 2050, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing30/400/300", stock: 50 },
    { name: "Clothing Item 31", description: "Description for Clothing Item 31", price: 4200, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing31/400/300", stock: 26 },
    { name: "Clothing Item 32", description: "Description for Clothing Item 32", price: 1250, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing32/400/300", stock: 65 },
    { name: "Clothing Item 33", description: "Description for Clothing Item 33", price: 2950, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing33/400/300", stock: 39 },
    { name: "Clothing Item 34", description: "Description for Clothing Item 34", price: 1850, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing34/400/300", stock: 53 },
    { name: "Clothing Item 35", description: "Description for Clothing Item 35", price: 3600, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing35/400/300", stock: 30 },
    { name: "Clothing Item 36", description: "Description for Clothing Item 36", price: 900, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing36/400/300", stock: 95 },
    { name: "Clothing Item 37", description: "Description for Clothing Item 37", price: 2450, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing37/400/300", stock: 46 },
    { name: "Clothing Item 38", description: "Description for Clothing Item 38", price: 3300, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing38/400/300", stock: 34 },
    { name: "Clothing Item 39", description: "Description for Clothing Item 39", price: 1300, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing39/400/300", stock: 64 },
    { name: "Clothing Item 40", description: "Description for Clothing Item 40", price: 2150, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing40/400/300", stock: 49 },
    { name: "Clothing Item 41", description: "Description for Clothing Item 41", price: 4800, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing41/400/300", stock: 22 },
    { name: "Clothing Item 42", description: "Description for Clothing Item 42", price: 1650, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing42/400/300", stock: 59 },
    { name: "Clothing Item 43", description: "Description for Clothing Item 43", price: 3050, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing43/400/300", stock: 37 },
    { name: "Clothing Item 44", description: "Description for Clothing Item 44", price: 1750, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing44/400/300", stock: 54 },
    { name: "Clothing Item 45", description: "Description for Clothing Item 45", price: 3900, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing45/400/300", stock: 29 },
    { name: "Clothing Item 46", description: "Description for Clothing Item 46", price: 750, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing46/400/300", stock: 110 },
    { name: "Clothing Item 47", description: "Description for Clothing Item 47", price: 2550, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing47/400/300", stock: 45 },
    { name: "Clothing Item 48", description: "Description for Clothing Item 48", price: 3400, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing48/400/300", stock: 33 },
    { name: "Clothing Item 49", description: "Description for Clothing Item 49", price: 1200, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing49/400/300", stock: 72 },
    { name: "Clothing Item 50", description: "Description for Clothing Item 50", price: 2850, category: "Clothing", imageUrl: "https://picsum.photos/seed/clothing50/400/300", stock: 41 },

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
    { name: "Supernova Shape Sorter", description: "Helps develop shape recognition.", price: 1400, category: "Toys", imageUrl: "https://picsum.photos/seed/toy11/400/300", stock: 58 },
    { name: "Pulsar Push Walker", description: "Helps babies learning to walk.", price: 4200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy12/400/300", stock: 28 },
    { name: "Quasar Wooden Puzzle Set", description: "Simple puzzles for toddlers.", price: 1800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy13/400/300", stock: 45 },
    { name: "Zenith Play Kitchenette", description: "Mini kitchen for imaginative play.", price: 8900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy14/400/300", stock: 12 },
    { name: "Meteor Musical Instrument Set", description: "Includes shakers, drum, xylophone.", price: 3500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy15/400/300", stock: 35 },
    // ...(Continue adding 35 more unique toy entries)
    { name: "Toy 16", description: "Description for Toy 16", price: 2500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy16/400/300", stock: 40 },
    { name: "Toy 17", description: "Description for Toy 17", price: 1100, category: "Toys", imageUrl: "https://picsum.photos/seed/toy17/400/300", stock: 65 },
    { name: "Toy 18", description: "Description for Toy 18", price: 5800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy18/400/300", stock: 19 },
    { name: "Toy 19", description: "Description for Toy 19", price: 1900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy19/400/300", stock: 52 },
    { name: "Toy 20", description: "Description for Toy 20", price: 4000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy20/400/300", stock: 26 },
    { name: "Toy 21", description: "Description for Toy 21", price: 850, category: "Toys", imageUrl: "https://picsum.photos/seed/toy21/400/300", stock: 85 },
    { name: "Toy 22", description: "Description for Toy 22", price: 3000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy22/400/300", stock: 33 },
    { name: "Toy 23", description: "Description for Toy 23", price: 1600, category: "Toys", imageUrl: "https://picsum.photos/seed/toy23/400/300", stock: 55 },
    { name: "Toy 24", description: "Description for Toy 24", price: 7000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy24/400/300", stock: 16 },
    { name: "Toy 25", description: "Description for Toy 25", price: 2200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy25/400/300", stock: 48 },
    { name: "Toy 26", description: "Description for Toy 26", price: 4500, category: "Toys", imageUrl: "https://picsum.photos/seed/toy26/400/300", stock: 24 },
    { name: "Toy 27", description: "Description for Toy 27", price: 1300, category: "Toys", imageUrl: "https://picsum.photos/seed/toy27/400/300", stock: 62 },
    { name: "Toy 28", description: "Description for Toy 28", price: 6200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy28/400/300", stock: 17 },
    { name: "Toy 29", description: "Description for Toy 29", price: 2000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy29/400/300", stock: 50 },
    { name: "Toy 30", description: "Description for Toy 30", price: 5000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy30/400/300", stock: 21 },
    { name: "Toy 31", description: "Description for Toy 31", price: 1000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy31/400/300", stock: 70 },
    { name: "Toy 32", description: "Description for Toy 32", price: 3800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy32/400/300", stock: 29 },
    { name: "Toy 33", description: "Description for Toy 33", price: 1700, category: "Toys", imageUrl: "https://picsum.photos/seed/toy33/400/300", stock: 53 },
    { name: "Toy 34", description: "Description for Toy 34", price: 8000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy34/400/300", stock: 14 },
    { name: "Toy 35", description: "Description for Toy 35", price: 2700, category: "Toys", imageUrl: "https://picsum.photos/seed/toy35/400/300", stock: 42 },
    { name: "Toy 36", description: "Description for Toy 36", price: 4900, category: "Toys", imageUrl: "https://picsum.photos/seed/toy36/400/300", stock: 23 },
    { name: "Toy 37", description: "Description for Toy 37", price: 1250, category: "Toys", imageUrl: "https://picsum.photos/seed/toy37/400/300", stock: 68 },
    { name: "Toy 38", description: "Description for Toy 38", price: 6800, category: "Toys", imageUrl: "https://picsum.photos/seed/toy38/400/300", stock: 15 },
    { name: "Toy 39", description: "Description for Toy 39", price: 2100, category: "Toys", imageUrl: "https://picsum.photos/seed/toy39/400/300", stock: 49 },
    { name: "Toy 40", description: "Description for Toy 40", price: 5300, category: "Toys", imageUrl: "https://picsum.photos/seed/toy40/400/300", stock: 20 },
    { name: "Toy 41", description: "Description for Toy 41", price: 950, category: "Toys", imageUrl: "https://picsum.photos/seed/toy41/400/300", stock: 80 },
    { name: "Toy 42", description: "Description for Toy 42", price: 3600, category: "Toys", imageUrl: "https://picsum.photos/seed/toy42/400/300", stock: 31 },
    { name: "Toy 43", description: "Description for Toy 43", price: 1550, category: "Toys", imageUrl: "https://picsum.photos/seed/toy43/400/300", stock: 57 },
    { name: "Toy 44", description: "Description for Toy 44", price: 7200, category: "Toys", imageUrl: "https://picsum.photos/seed/toy44/400/300", stock: 18 },
    { name: "Toy 45", description: "Description for Toy 45", price: 2400, category: "Toys", imageUrl: "https://picsum.photos/seed/toy45/400/300", stock: 46 },
    { name: "Toy 46", description: "Description for Toy 46", price: 4700, category: "Toys", imageUrl: "https://picsum.photos/seed/toy46/400/300", stock: 25 },
    { name: "Toy 47", description: "Description for Toy 47", price: 1150, category: "Toys", imageUrl: "https://picsum.photos/seed/toy47/400/300", stock: 69 },
    { name: "Toy 48", description: "Description for Toy 48", price: 6000, category: "Toys", imageUrl: "https://picsum.photos/seed/toy48/400/300", stock: 19 },
    { name: "Toy 49", description: "Description for Toy 49", price: 1850, category: "Toys", imageUrl: "https://picsum.photos/seed/toy49/400/300", stock: 54 },
    { name: "Toy 50", description: "Description for Toy 50", price: 5100, category: "Toys", imageUrl: "https://picsum.photos/seed/toy50/400/300", stock: 22 },
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

