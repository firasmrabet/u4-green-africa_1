import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Configuration Firebase
 * À remplir avec tes propres clés depuis la console Firebase
 * https://console.firebase.google.com/
 */
// Vite uses `import.meta.env` and requires env variables to be prefixed with VITE_
// Keep a fallback to REACT_APP_* to support older env files.
const firebaseConfig = {
  apiKey:
    (import.meta as any).env.VITE_FIREBASE_API_KEY ||
    process.env.REACT_APP_FIREBASE_API_KEY ||
    'YOUR_API_KEY',
  authDomain:
    (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN ||
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    'your-project.firebaseapp.com',
  projectId:
    (import.meta as any).env.VITE_FIREBASE_PROJECT_ID ||
    process.env.REACT_APP_FIREBASE_PROJECT_ID ||
    'your-project-id',
  storageBucket:
    (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET ||
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    'your-project.appspot.com',
  messagingSenderId:
    (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
    'YOUR_SENDER_ID',
  appId:
    (import.meta as any).env.VITE_FIREBASE_APP_ID ||
    process.env.REACT_APP_FIREBASE_APP_ID ||
    'YOUR_APP_ID',
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Récupérer les services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
