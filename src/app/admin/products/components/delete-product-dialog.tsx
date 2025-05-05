
'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteProductAction } from '@/actions/adminProductActions'; // Import the delete action
import { Loader2 } from 'lucide-react'; // Import Loader icon

interface DeleteProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export default function DeleteProductDialog({ isOpen, onClose, product }: DeleteProductDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    async function handleDeleteConfirm() {
        setIsLoading(true);
        try {
            const result = await deleteProductAction(product.id);

            if (result.success) {
                toast({
                    title: 'Product Deleted',
                    description: `"${product.name}" has been successfully deleted.`,
                });
                onClose(); // Close the dialog on success
                // Parent component should ideally refresh the list
            } else {
                toast({
                    title: 'Error Deleting Product',
                    description: result.error || 'An unknown error occurred.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred while deleting the product.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Prevent rendering if product is null (safety check)
    if (!product) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product
                        <span className="font-semibold"> "{product.name}"</span> and remove its data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose} disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Yes, Delete Product'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
