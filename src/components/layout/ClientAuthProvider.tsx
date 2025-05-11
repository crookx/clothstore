'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect } from 'react';

const AuthContext = createContext<null>(null);

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const token = document.cookie.includes('auth-token');
      const redirect = searchParams?.get('redirect');
      
      if (token && redirect) {
        router.replace(redirect);
      }
    };

    handleAuthRedirect();
  }, [router, searchParams]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}