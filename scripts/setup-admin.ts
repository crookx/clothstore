import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const ADMIN_EMAIL = 'qaranadmin@email.com';
const ADMIN_PASSWORD = 'qaranbaby';

async function setupAdmin() {
  // Initialize admin SDK
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
    });
  }

  try {
    // Create or update user
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(ADMIN_EMAIL);
      console.log('Admin user exists:', userRecord.uid);
    } catch (error) {
      userRecord = await admin.auth().createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true
      });
      console.log('Created admin user:', userRecord.uid);
    }

    // Set admin claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    console.log('Set admin claims for:', userRecord.email);

  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}

setupAdmin();