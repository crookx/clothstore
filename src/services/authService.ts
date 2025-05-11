import { 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  signOut,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function registerUser(data: RegisterData) {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  await updateProfile(user, {
    displayName: `${data.firstName} ${data.lastName}`
  });

  await sendEmailVerification(user);

  return user;
}

export async function sendVerificationEmail(user: User) {
  return sendEmailVerification(user);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function signIn(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function logOut() {
  return signOut(auth);
}

export async function updateUserProfile(user: User, data: {
  firstName?: string;
  lastName?: string;
  photoURL?: string;
}) {
  const updates: {
    displayName?: string;
    photoURL?: string;
  } = {};

  if (data.firstName || data.lastName) {
    const currentNames = user.displayName?.split(' ') || ['', ''];
    updates.displayName = `${data.firstName || currentNames[0]} ${data.lastName || currentNames[1]}`;
  }

  if (data.photoURL) {
    updates.photoURL = data.photoURL;
  }

  return updateProfile(user, updates);
}

export async function updateUserEmail(user: User, newEmail: string, password: string) {
  const credential = EmailAuthProvider.credential(user.email!, password);
  await reauthenticateWithCredential(user, credential);
  await updateEmail(user, newEmail);
  await sendEmailVerification(user);
}

export async function updateUserPassword(user: User, currentPassword: string, newPassword: string) {
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);
  return updatePassword(user, newPassword);
}

export async function deleteUserAccount(user: User, password: string) {
  const credential = EmailAuthProvider.credential(user.email!, password);
  await reauthenticateWithCredential(user, credential);
  return user.delete();
}