import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setAdminRole = functions.https.onCall(async (data, context: functions.https.CallableContext) => {
  // Check if the request is from an authorized user
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  }

  try {
    const { email } = data;
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { message: `Successfully set admin role for ${email}` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error setting admin role');
  }
});