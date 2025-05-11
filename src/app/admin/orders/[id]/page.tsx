'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, Mail } from 'lucide-react';

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            // API call to update order status
            // await updateOrderStatus(id, newStatus);
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Order #{order?.orderNumber}</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                    </Button>
                    <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Customer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={order?.status}
                            onValueChange={handleStatusUpdate}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {order?.customer?.name}</p>
                            <p><strong>Email:</strong> {order?.customer?.email}</p>
                            <p><strong>Phone:</strong> {order?.customer?.phone}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p><strong>Method:</strong> {order?.payment?.method}</p>
                            <p><strong>Status:</strong> 
                                <Badge className="ml-2" variant={order?.payment?.status === 'paid' ? 'default' : 'destructive'}>
                                    {order?.payment?.status}
                                </Badge>
                            </p>
                            <p><strong>Transaction ID:</strong> {order?.payment?.transactionId}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="items" className="w-full">
                <TabsList>
                    <TabsTrigger value="items">Order Items</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="items">
                    {/* Order items table */}
                </TabsContent>
                
                <TabsContent value="shipping">
                    {/* Shipping details and tracking */}
                </TabsContent>
                
                <TabsContent value="history">
                    {/* Order history timeline */}
                </TabsContent>
            </Tabs>
        </div>
    );
}