import * as admin from 'firebase-admin';
import { getFirebaseServices } from '@/lib/firebase/config';

const ADMIN_EMAIL = 'admin@clothstore.com';
const ADMIN_PASSWORD = 'admin123456'; // Change this to a secure password

async function createAdminUser() {
  try {
    // Initialize Firebase Admin
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    // Create user if doesn't exist
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(ADMIN_EMAIL);
      console.log('Admin user already exists');
    } catch (error) {
      userRecord = await admin.auth().createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
      });
      console.log('Created new admin user');
    }

    // Set admin custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true
    });

    console.log(`Successfully set admin claims for ${ADMIN_EMAIL}`);
    return userRecord;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('Admin user setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to setup admin user:', error);
    process.exit(1);
  });