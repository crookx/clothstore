'use client';

import { createContext, useContext, useState } from 'react';
import { Address } from '@/types/profile';

interface CheckoutContextType {
  shippingAddress: Address | null;
  setShippingAddress: (address: Address) => void;
  paymentMethod: string | null;
  setPaymentMethod: (method: string) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  return (
    <CheckoutContext.Provider
      value={{
        shippingAddress,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}