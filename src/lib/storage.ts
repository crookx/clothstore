import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
}

export async function uploadToStorage(
  file: File, 
  path: string = 'uploads'
): Promise<UploadResult> {
  if (!file) throw new Error('No file provided');

  const filename = `${Date.now()}_${file.name}`;
  const fullPath = `${path}/${filename}`;
  const storageRef = ref(storage, fullPath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return {
      url,
      path: fullPath,
      filename
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}