
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { addProductAction } from '@/actions/adminProductActions'; // Import the action
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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
    "Nursery", // Added category
    "Safety", // Added category
];


export default function AddProductForm() {
    const [isLoading, setIsLoading] = useState(false);
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

    async function onSubmit(data: ProductFormData) {
        setIsLoading(true);
        try {
            const result = await addProductAction(data);

            if (result.success) {
                toast({
                    title: 'Product Added',
                    description: `"${data.name}" has been successfully added.`,
                });
                form.reset(); // Clear the form
                // Optionally, trigger a refresh of the product list if needed
                // router.refresh(); // If using Next.js App Router navigation
            } else {
                 toast({
                     title: 'Error Adding Product',
                     description: result.error || 'An unknown error occurred.',
                     variant: 'destructive',
                 });
            }
        } catch (error) {
             console.error("Failed to add product:", error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred while adding the product.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

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
                                            {/* Ensure input type allows decimals */}
                                            <Input type="number" step="any" min="0" placeholder="e.g., 15000.50" {...field} disabled={isLoading} />
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
                                            <Input type="number" step="1" min="0" placeholder="e.g., 25" {...field} disabled={isLoading} />
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
                            {isLoading ? 'Adding Product...' : 'Add Product'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
