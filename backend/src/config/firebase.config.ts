// Import firebase-admin dynamically so backend remains optional in environments where it's not installed
// Add declarations so editors without Node types installed don't show errors
declare var require: any;
declare const process: any;
// (useful for developers focusing on frontend only).
let admin: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  admin = require('firebase-admin');
} catch (err) {
  // Not installed — user can run `npm install` in backend to enable admin features
}

// Safe initialization when admin SDK is available.
// Priority: 1) If GOOGLE_APPLICATION_CREDENTIALS or ADC exist, use applicationDefault().
// 2) Else if local `serviceAccountKey.json` exists next to this file, load it with `credential.cert()`.
// 3) Else leave uninitialized so backend can still run in limited mode.
if (admin && !admin.apps.length) {
  const path = require('path');
  const fs = require('fs');
  const projectIdFromEnv = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

  // If explicit credentials are already provided in the environment, prefer ADC
  const hasADC = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (hasADC) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: projectIdFromEnv,
    });
  } else {
    // Look for a local service account file (do NOT commit this file to source control)
    const localKeyPath = path.join(__dirname, '..', '..', 'serviceAccountKey.json');
    if (fs.existsSync(localKeyPath)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require(localKeyPath);
        const inferredProjectId = serviceAccount.project_id || projectIdFromEnv;
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: inferredProjectId,
        });
      } catch (err) {
        // If loading fails, fall back to ADC which will likely error later if absent.
        // Keep process alive — callers should handle missing admin.
        try {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: projectIdFromEnv,
          });
        } catch (e) {
          // final fallback: do nothing
        }
      }
    } else {
      // No local key — try ADC as a last resort (may still throw if not available)
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: projectIdFromEnv,
        });
      } catch (e) {
        // Leave admin uninitialized
      }
    }
  }
}

export const adminApp: any = admin || null;
export const db: any = admin && admin.apps.length ? admin.firestore() : null;
export const auth: any = admin && admin.apps.length ? admin.auth() : null;

export default adminApp;
