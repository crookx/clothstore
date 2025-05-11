'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/types/profile';
import { formatDate } from '@/lib/utils';

export default function OrdersPage() {
  const [orders] = useState<Order[]>([]);

  const statusColors = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm">View Details</Button>
                    <Button size="sm" variant="outline">Track Order</Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No orders found</p>
                <Link href="/products">
                  <Button className="mt-4">Start Shopping</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}