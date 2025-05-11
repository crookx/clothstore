import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = require('../../../serviceAccountKey.json');

if (!serviceAccount?.project_id || !serviceAccount?.client_email || !serviceAccount?.private_key) {
  throw new Error('Invalid service account configuration');
}

const adminConfig = {
  credential: cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
};

function initAdmin() {
  if (getApps().length === 0) {
    return initializeApp(adminConfig);
  }
  return getApps()[0];
}

const app = initAdmin();
export const adminAuth = getAuth(app);