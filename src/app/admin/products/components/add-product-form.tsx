
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '@/lib/schemas/productSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react'; // Import useEffect
import { addProductAction } from '@/actions/adminProductActions'; // Import the action
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react'; // Import icons
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Import Alert
import { getFirebaseServices } from '@/lib/firebase/config'; // Import check function


// Define available categories (you might fetch these dynamically later)
const productCategories = [
    "Strollers",
    "Car Seats",
    "Cribs",
    "Monitors",
    "Feeding",
    "Clothing",
    "Toys",
    "Diapering",
    "Bathing",
    "Gear",
    "Nursery",
    "Safety",
];


export default function AddProductForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFirebaseReady, setIsFirebaseReady] = useState<boolean | null>(null); // Track Firebase readiness
    const { toast } = useToast();
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            category: '',
            imageUrl: '',
            stock: 0,
        },
    });

     // Check Firebase readiness on mount
     useEffect(() => {
        const services = getFirebaseServices();
        setIsFirebaseReady(!!services); // Set state based on whether services are available
     }, []);

    async function onSubmit(data: ProductFormData) {
         // Double check Firebase readiness before submitting
         if (!isFirebaseReady) {
             toast({
                 title: 'Error',
                 description: 'Cannot add product. Core services are unavailable.',
                 variant: 'destructive',
             });
             return;
         }

        setIsLoading(true);
        try {
            // Ensure price and stock are numbers before sending
            const dataToSend = {
              ...data,
              price: Number(data.price),
              stock: Number(data.stock),
            };

            const result = await addProductAction(dataToSend);

            if (result.success) {
                toast({
                    title: 'Product Added',
                    description: `"${data.name}" has been successfully added.`,
                    variant: 'default', // Use default or success style
                });
                form.reset(); // Clear the form
                // Optionally, trigger a refresh of the product list if needed
                // Consider using router.refresh() or a dedicated state management solution
            } else {
                 toast({
                     title: 'Error Adding Product',
                     description: result.error || 'An unknown error occurred.',
                     variant: 'destructive',
                 });
            }
        } catch (error) {
             console.error("Failed to add product via action:", error);
            toast({
                title: 'Action Error',
                description: 'An unexpected error occurred while submitting the product.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

     // Show loading state while checking Firebase readiness
     if (isFirebaseReady === null) {
         return (
             <Card>
                 <CardHeader>
                     <CardTitle>Add New Product</CardTitle>
                     <CardDescription>Checking service availability...</CardDescription>
                 </CardHeader>
                 <CardContent className="flex justify-center items-center py-10">
                     <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                 </CardContent>
             </Card>
         );
     }

     // Show error if Firebase is not ready
     if (!isFirebaseReady) {
         return (
            <Card>
                 <CardHeader>
                     <CardTitle>Add New Product</CardTitle>
                 </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Service Unavailable</AlertTitle>
                        <AlertDescription>
                            Cannot add products because the connection to Firebase failed. Please check your configuration and ensure the server is running.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
         );
     }

    // Render the form if Firebase is ready
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                 <CardDescription>Fill in the details for the new product.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Cosmic Comfort Stroller" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the product features and benefits..."
                                            className="resize-y min-h-[100px]"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (KES)</FormLabel>
                                        <FormControl>
                                            {/* Use text input type for better control, coerce in schema/action */}
                                            <Input type="text" inputMode="decimal" placeholder="e.g., 15000.50" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                             {/* Use text input type, coerce in schema/action */}
                                            <Input type="text" inputMode="numeric" placeholder="e.g., 25" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {productCategories.map((cat) => (
                                      <SelectItem key={cat} value={cat}>
                                        {cat}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />


                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.jpg or leave blank for placeholder" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the full URL of the product image. Use a service like Firebase Storage or Picsum Photos. Leave blank to use a default placeholder.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add Product'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
