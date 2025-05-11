import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const orderColumns = [
  {
    id: 'orderId',
    header: 'Order ID',
    cell: (order: any) => <span className="font-medium">{order.id}</span>
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: (order: any) => order.customerName || 'Anonymous'
  },
  {
    id: 'date',
    header: 'Date',
    cell: (order: any) => formatDate(order.createdAt)
  },
  {
    id: 'status',
    header: 'Status',
    cell: (order: any) => (
      <Badge variant={getStatusVariant(order.status)}>
        {order.status}
      </Badge>
    )
  },
  {
    id: 'total',
    header: 'Total',
    cell: (order: any) => (
      <span className="font-medium">
        KES {order.total.toFixed(2)}
      </span>
    )
  }
];

function getStatusVariant(status: string): "default" | "secondary" | "success" | "destructive" {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'destructive';
    case 'processing':
      return 'secondary';
    default:
      return 'default';
  }
}