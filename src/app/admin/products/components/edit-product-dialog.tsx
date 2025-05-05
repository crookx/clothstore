
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '@/lib/schemas/productSchema';
import type { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateProductAction } from '@/actions/adminProductActions'; // Import the update action

interface EditProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

// Define available categories (should match add-product-form)
const productCategories = [
    "Strollers", "Car Seats", "Cribs", "Monitors", "Feeding",
    "Clothing", "Toys", "Diapering", "Bathing", "Gear",
    "Nursery", "Safety",
];

export default function EditProductDialog({ isOpen, onClose, product }: EditProductDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl === 'https://picsum.photos/seed/placeholder/400/300' ? '' : product.imageUrl, // Show empty if it's placeholder
            stock: product.stock,
        },
    });

     // Reset form when product changes or dialog opens/closes
     // This ensures the correct product data is loaded each time
     useState(() => {
        form.reset({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl === 'https://picsum.photos/seed/placeholder/400/300' ? '' : product.imageUrl,
            stock: product.stock,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product, isOpen]); // Depend on product and isOpen


    async function onSubmit(data: ProductFormData) {
        setIsLoading(true);
        try {
            // Only send fields that have actually changed (optional optimization)
            // For simplicity, we send all validated data now.
            const result = await updateProductAction(product.id, data);

            if (result.success) {
                toast({
                    title: 'Product Updated',
                    description: `"${data.name}" has been successfully updated.`,
                });
                onClose(); // Close the dialog on success
                // Parent component should ideally refresh the list
            } else {
                toast({
                    title: 'Error Updating Product',
                    description: result.error || 'An unknown error occurred.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error("Failed to update product:", error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred while updating the product.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Product: {product.name}</DialogTitle>
                    <DialogDescription>
                        Make changes to the product details below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                         <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isLoading} />
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
                                            className="resize-y min-h-[80px]"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (KES)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="any" min="0" {...field} disabled={isLoading} />
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
                                            <Input type="number" step="1" min="0" {...field} disabled={isLoading} />
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
                                        <Input placeholder="Leave blank for placeholder" {...field} disabled={isLoading} />
                                    </FormControl>
                                     <FormDescription>
                                         Enter the full URL of the product image. Leave blank to keep using the default placeholder.
                                     </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
