'use client';

import AddProductForm from './components/add-product-form';
import ProductListAdmin from './components/product-list-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, List, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from 'react';

interface ErrorProps {
    onError: (error: Error) => void;
}

interface ErrorState {
    message: string;
}

export default function AdminProductsPage() {
    const [error, setError] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnlineStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        
        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    if (!isOnline) {
        return (
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>
                    You are currently offline. Please check your internet connection and try again.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-primary">Product Management</h1>
            
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="view-products" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="add-product">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
                    </TabsTrigger>
                    <TabsTrigger value="view-products">
                        <List className="mr-2 h-4 w-4" /> View Products
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="add-product">
                    <AddProductForm onError={(err: Error) => setError(err.message)} />
                </TabsContent>

                <TabsContent value="view-products">
                    <ProductListAdmin onError={(err: Error) => setError(err.message)} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
