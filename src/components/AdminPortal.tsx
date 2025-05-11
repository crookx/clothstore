'use client';

import { ReactNode } from 'react';
import { useIsClient } from '@/utils/useIsClient';

export function AdminPortal({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  
  if (!isClient) {
    return null; // or a loading state
  }

  return <>{children}</>;
}