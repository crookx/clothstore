import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Order {
  id: string
  customer: string
  product: string
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  date: string
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 rounded-lg border border-navy-700 bg-navy-800"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{order.customer}</p>
              <p className="text-sm text-muted-foreground">{order.product}</p>
            </div>
            <div className="ml-auto font-medium">
              <div className="flex flex-col items-end gap-1">
                <span className="text-green-500">${order.total}</span>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  {
                    "bg-yellow-500/10 text-yellow-500": order.status === "pending",
                    "bg-blue-500/10 text-blue-500": order.status === "processing",
                    "bg-green-500/10 text-green-500": order.status === "completed",
                    "bg-red-500/10 text-red-500": order.status === "cancelled",
                  }
                )}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}