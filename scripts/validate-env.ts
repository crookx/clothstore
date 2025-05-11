import { config } from 'dotenv';
import * as path from 'path';
import { existsSync } from 'fs';

const requiredEnvVars = [
  'RESEND_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

function validateEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  
  if (!existsSync(envPath)) {
    console.error('❌ .env.local file not found');
    process.exit(1);
  }

  config({ path: envPath });

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    process.exit(1);
  }

  // Validate FIREBASE_PRIVATE_KEY format
  if (process.env.FIREBASE_PRIVATE_KEY) {
    try {
      const formattedKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error('❌ FIREBASE_PRIVATE_KEY is not in the correct format');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Error validating FIREBASE_PRIVATE_KEY format');
      process.exit(1);
    }
  }

  console.log('✅ All required environment variables are present and valid');
}

validateEnv();