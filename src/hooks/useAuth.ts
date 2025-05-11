import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { getFirebaseServices } from '@/lib/firebase/config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const services = getFirebaseServices();
    if (!services) {
      setError('Firebase services not available');
      setLoading(false);
      return;
    }

    const unsubscribe = services.auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
}