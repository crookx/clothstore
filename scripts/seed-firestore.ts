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
import * as admin from 'firebase-admin';
import { faker } from '@faker-js/faker';
import type { Product } from '@/types/product'; // Adjust path if necessary
import { Review } from '@/types/product';

// Helper functions for product attributes
function getSizesForCategory(category: string, productName: string): string[] {
  const sizeMappings: { [key: string]: string[] } = {
    'Shirts': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Pants': ['28', '30', '32', '34', '36', '38', '40'],
    'Dresses': ['XS', 'S', 'M', 'L', 'XL'],
    'Accessories': ['One Size']
  };

  const availableSizes = sizeMappings[category] || ['S', 'M', 'L'];
  return faker.helpers.arrayElements(availableSizes, 
    faker.number.int({ min: Math.floor(availableSizes.length / 2), max: availableSizes.length })
  );
}

function getColorsForCategory(category: string): string[] {
  const commonColors = [
    'Black', 'White', 'Navy', 'Gray', 'Blue', 
    'Red', 'Green', 'Brown', 'Beige', 'Pink'
  ];

  const categoryColors: { [key: string]: string[] } = {
    'Shirts': ['Light Blue', 'White', 'Pink', 'Black', 'Navy', 'Striped'],
    'Pants': ['Black', 'Navy', 'Khaki', 'Gray', 'Brown', 'Olive'],
    'Dresses': ['Black', 'Red', 'Navy', 'Floral', 'Pink', 'Blue'],
    'Accessories': ['Black', 'Brown', 'Tan', 'Silver', 'Gold']
  };

  const baseColors = categoryColors[category] || commonColors;
  return faker.helpers.arrayElements(baseColors, 
    faker.number.int({ min: 2, max: Math.min(5, baseColors.length) })
  );
}

// --- Configuration ---
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID; // Get Project ID from env
const COLLECTION_NAME = 'products';
const BATCH_SIZE = 100; // Firestore batch write limit is 500 operations

// --- Environment Variable Validation ---
if (!PROJECT_ID || PROJECT_ID === "YOUR_PROJECT_ID_HERE") {
  const errorMessage =
    `\n❌ Configuration Error:\n` +
    ` Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable not set or still has the placeholder value.` +
    ` Please ensure it is set correctly in your .env.local file and you have replaced "YOUR_PROJECT_ID_HERE" with your actual Firebase Project ID.` +
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

// Helper function to generate multiple images for a product
function generateProductImages(category: string, productName?: string): string[] {
  return Array.from({ length: faker.number.int({ min: 4, max: 8 }) }, () => {
    // Use a more reliable Unsplash collection
    const width = 800;
    const height = 800;
    const categoryQuery = encodeURIComponent(category.toLowerCase());
    const randomSeed = faker.string.alphanumeric(10);
    
    return `https://source.unsplash.com/collection/3816160/${width}x${height}?${categoryQuery}&seed=${randomSeed}`;
  });
}

// Generate detailed product features
function generateFeatures(category: string): string[] {
  const commonFeatures = [
    'Premium Quality Materials',
    'Ethically Manufactured',
    'Easy Care Instructions',
    'Satisfaction Guaranteed'
  ];

  const categoryFeatures: { [key: string]: string[] } = {
    'Shirts': [
      'Breathable Fabric',
      'Wrinkle Resistant',
      'UV Protection',
      'Moisture Wicking'
    ],
    'Pants': [
      'Stretch Comfort',
      'Stain Resistant',
      'Multiple Pockets',
      'Reinforced Stitching'
    ],
    // Add more categories as needed
  };

  const features = [...commonFeatures];
  if (categoryFeatures[category]) {
    features.push(...faker.helpers.arrayElements(categoryFeatures[category], 3));
  }

  return faker.helpers.arrayElements(features, faker.number.int({ min: 4, max: 6 }));
}

// Generate specifications
function generateSpecifications(category: string): Record<string, string> {
  const specs: Record<string, string> = {
    'Material Composition': faker.helpers.arrayElement([
      '100% Cotton',
      '95% Cotton, 5% Elastane',
      '80% Polyester, 20% Cotton'
    ]),
    'Care Instructions': 'Machine wash cold, Tumble dry low',
    'Country of Origin': faker.location.country(),
    'Manufacturer': faker.company.name()
  };

  // Add category-specific specifications
  switch (category.toLowerCase()) {
    case 'shirts':
      specs['Collar Type'] = faker.helpers.arrayElement(['Regular', 'Button-down', 'Spread']);
      specs['Sleeve Length'] = faker.helpers.arrayElement(['Short', 'Long', '3/4']);
      break;
    case 'pants':
      specs['Rise'] = faker.helpers.arrayElement(['Low', 'Mid', 'High']);
      specs['Leg Style'] = faker.helpers.arrayElement(['Straight', 'Slim', 'Regular']);
      break;
    // Add more categories
  }

  return specs;
}

// Generate reviews
function generateReviews(productId: string): any[] {
  return Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => ({
    id: faker.string.uuid(),
    productId,
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    rating: faker.number.int({ min: 3, max: 5 }),
    comment: faker.lorem.paragraph(),
    date: faker.date.past().toISOString(),
    verified: faker.datatype.boolean(),
    helpful: faker.number.int({ min: 0, max: 50 }),
    images: faker.datatype.boolean() ?
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
        faker.image.url({ width: 800, height: 600 })) :
      [],
  }));
}

// Add categories constant to match our navigation
const PRODUCT_CATEGORIES = [
  {
    id: 'clothing-apparel',
    name: 'Clothing & Apparel',
    products: ['Baby Onesie', 'Infant Romper', 'Baby Dress', 'Toddler Outfit', 'Baby Sweater']
  },
  {
    id: 'nursery-furniture',
    name: 'Nursery & Furniture',
    products: ['Baby Crib', 'Changing Table', 'Rocking Chair', 'Storage Cabinet', 'Baby Monitor']
  },
  {
    id: 'feeding-essentials',
    name: 'Feeding Essentials',
    products: ['Baby Bottle', 'High Chair', 'Feeding Set', 'Breast Pump', 'Food Maker']
  },
  {
    id: 'health-safety',
    name: 'Health & Safety',
    products: ['Baby Gate', 'Monitor Camera', 'Thermometer', 'First Aid Kit', 'Air Purifier']
  },
  {
    id: 'bath-skincare',
    name: 'Bath & Skincare',
    products: ['Baby Shampoo', 'Bath Tub', 'Towel Set', 'Skincare Set', 'Bath Toys']
  },
  {
    id: 'travel-gear',
    name: 'Travel Gear',
    products: ['Stroller', 'Car Seat', 'Baby Carrier', 'Diaper Bag', 'Travel Crib']
  },
  {
    id: 'play-learning',
    name: 'Play & Learning',
    products: ['Educational Toys', 'Building Blocks', 'Art Supplies', 'Musical Toys', 'Books']
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    products: ['Diapers', 'Wipes', 'Changing Mat', 'Diaper Pail', 'Baby Lotion']
  }
];

// Main product generation
async function seedProducts() {
  const batch = db.batch();
  const products: any[] = [];

  // Generate products for each category
  for (const category of PRODUCT_CATEGORIES) {
    // Generate 5-8 products per category
    const productsToCreate = faker.number.int({ min: 5, max: 8 });
    
    for (let i = 0; i < productsToCreate; i++) {
      const productBase = faker.helpers.arrayElement(category.products);
      const product = {
        id: faker.string.uuid(),
        name: `${faker.commerce.productAdjective()} ${productBase}`,
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 1000, max: 10000 })),
        categoryId: category.id, // Important: This matches our navigation
        categoryName: category.name,
        imageUrls: generateProductImages(category.name),
        stock: faker.number.int({ min: 0, max: 100 }),
        sizes: getSizesForCategory(category.name, productBase),
        colors: getColorsForCategory(category.name),
        dateAdded: faker.date.past().toISOString(),
        features: generateFeatures(category.name),
        specifications: generateSpecifications(category.name),
        averageRating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
        reviewCount: faker.number.int({ min: 5, max: 500 }),
        relatedProducts: [], // Will be populated after all products are created
        tags: faker.helpers.arrayElements([
          'New Arrival', 'Best Seller', 'Sale', 'Premium', 'Limited Edition'
        ], faker.number.int({ min: 1, max: 3 }))
      };

      products.push(product);
      const docRef = db.collection('products').doc(product.id);
      batch.set(docRef, product);
    }
  }

  // Add related products
  products.forEach(product => {
    product.relatedProducts = faker.helpers.arrayElements(
      products.filter(p => p.id !== product.id).map(p => p.id),
      faker.number.int({ min: 3, max: 6 })
    );
  });

  // Update products with related products
  products.forEach(product => {
    const docRef = db.collection('products').doc(product.id);
    batch.update(docRef, { relatedProducts: product.relatedProducts });
  });

  // Generate and store reviews
  products.forEach(product => {
    const reviews = generateReviews(product.id);
    reviews.forEach(review => {
      const reviewRef = db.collection('reviews').doc(review.id);
      batch.set(reviewRef, review);
    });
  });

  // Commit the batch
  try {
    await batch.commit();
    console.log(`Successfully seeded ${products.length} products with reviews and related products`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seeding
seedProducts().then(() => {
  console.log('Seeding completed successfully');
  process.exit(0);
}).catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
