'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types/order';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Row, ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DownloadIcon, 
  FileText,
  Search 
} from 'lucide-react';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID"
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }: { row: Row<Order> }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: Row<Order> }) => {
      return (
        <Select
          defaultValue={row.getValue("status")}
          onValueChange={async (value) => {
            await updateOrderStatus(row.original.id, value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      )
    }
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }: { row: Row<Order> }) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("total"));
    }
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<Order> }) => {
      const order = row.original;
      return (
        <Button
          variant="ghost"
          onClick={() => {
            // Open order details modal
          }}
        >
          <FileText className="h-4 w-4" />
          <span className="sr-only">View order details</span>
        </Button>
      );
    }
  }
];

async function updateOrderStatus(orderId: string, status: string) {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Failed to update status');
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={orders}
      />
    </div>
  );
}