'use client';

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusColors = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500"
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="font-medium">{order.customer}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium">
                ${order.total.toLocaleString()}
              </p>
              <Badge className={statusColors[order.status]}>
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}