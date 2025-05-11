import { getAdminApp, adminAuth } from '../src/lib/firebase/admin-edge';

async function verifyAdminConfig() {
  try {
    const app = getAdminApp();
    console.log('✅ Firebase Admin app initialized');

    // Test auth
    await adminAuth.listUsers(1);
    console.log('✅ Firebase Admin auth verified');

    process.exit(0);
  } catch (error) {
    console.error('❌ Firebase Admin verification failed:', error);
    process.exit(1);
  }
}

verifyAdminConfig();