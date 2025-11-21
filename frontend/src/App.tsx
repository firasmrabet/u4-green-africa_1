import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth } from './config/firebase.config';
import './styles/tokens.css';
import { LoadingProvider } from './contexts/LoadingContext';

export default function App() {
  useEffect(() => {
    // Handle Firebase redirect result after signInWithRedirect
    (async () => {
      try {
        const result = await getRedirectResult(auth as any).catch(() => null);
        if (result && result.user) {
          const idToken = await result.user.getIdToken();
          // Send to backend for verification and optional user creation
          const apiUrl = (import.meta as any).env.VITE_API_URL || (process.env.REACT_APP_API_URL as string) || 'http://localhost:5000';
          await fetch(`${apiUrl}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          }).catch(() => null);
        }
      } catch (err) {
        // ignore — user will still be signed in client-side
        console.warn('Redirect result handling error', err);
      }
    })();
  }, []);

  return (
    <LoadingProvider>
      <Router>
        <AppRouter />
      </Router>
    </LoadingProvider>
  );
}
