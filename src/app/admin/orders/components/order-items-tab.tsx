import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from 'next/image';

interface OrderItem {
    id: string;
    productName: string;
    productImage: string;
    variant: string;
    quantity: number;
    price: number;
    total: number;
}

interface OrderItemsTabProps {
    items: OrderItem[];
}

export default function OrderItemsTab({ items }: OrderItemsTabProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>
                            <Image
                                src={item.productImage}
                                alt={item.productName}
                                width={80}
                                height={80}
                                className="rounded-md"
                            />
                        </TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.variant}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}