'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddressForm } from '@/components/profile/AddressForm';
import { useCheckout } from '@/context/checkout-context';
import { Address } from '@/types/profile';

export default function ShippingPage() {
  const router = useRouter();
  const { setShippingAddress, shippingAddress } = useCheckout();
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    shippingAddress ?? undefined
  );

  const handleContinue = () => {
    if (selectedAddress) {
      setShippingAddress(selectedAddress);
      router.push('/checkout/payment');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Shipping Address</h1>
        <AddressForm
          address={selectedAddress}
          onSubmit={(address) => {
            setSelectedAddress(address);
          }}
          onCancel={() => router.back()}
        />
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedAddress}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}