import * as admin from 'firebase-admin';
import { getFirebaseServices } from '@/lib/firebase/config';

const ADMIN_CONFIG = {
  email: 'admin@clothstore.com',
  password: 'Admin123!@#',
  displayName: 'Store Admin'
};

async function createAdminUser() {
  try {
    // Initialize Firebase Admin
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(require('../serviceAccountKey.json')),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      });
    }

    // Create or update user
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(ADMIN_CONFIG.email);
      console.log('ℹ️ Admin user already exists:', userRecord.uid);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await admin.auth().createUser({
          email: ADMIN_CONFIG.email,
          password: ADMIN_CONFIG.password,
          displayName: ADMIN_CONFIG.displayName,
          emailVerified: true
        });
        console.log('✅ Created new admin user:', userRecord.uid);
      } else {
        throw error;
      }
    }

    // Set admin claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    console.log('✅ Set admin claims for:', userRecord.email);

    return userRecord;
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    throw error;
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('✅ Admin setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to setup admin:', error);
    process.exit(1);
  });