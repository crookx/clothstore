import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from './admin-edge';

export const adminDb = getFirestore(getFirebaseAdminApp());