'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';
import { Address } from '@/types/profile';
import { AddressForm } from '@/components/profile/AddressForm';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>

        {isAdding && (
          <AddressForm
            onSubmit={(address) => {
              setAddresses([...addresses, address]);
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{address.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.street}
                    <br />
                    {address.city}, {address.state} {address.zipCode}
                    <br />
                    {address.country}
                  </p>
                  <p className="text-sm mt-2">{address.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-500">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}