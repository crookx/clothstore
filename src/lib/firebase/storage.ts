import { getFirebaseServices } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Update this with your actual Firebase Storage URL
export const PLACEHOLDER_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/YOUR_PROJECT_ID.appspot.com/o/placeholders%2Fdefault-product.jpg';

export function getImageUrl(imageUrls: string[] | undefined): string {
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return PLACEHOLDER_IMAGE_URL;
  }
  return imageUrls[0];
}

export async function uploadImageToFirebase(file: File, path: string): Promise<string> {
  const services = getFirebaseServices();
  if (!services?.storage) throw new Error('Firebase storage not available');

  const storageRef = ref(services.storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}