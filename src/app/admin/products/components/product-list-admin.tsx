'use client';

import { useState, useEffect } from 'react';
import { fetchProducts } from '@/services/productService';
import type { Product } from '@/types/product';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { firebaseInitializationError } from '@/lib/firebase/config'; // Import the error state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import EditProductDialog from './edit-product-dialog'; // Import the Edit dialog
import DeleteProductDialog from './delete-product-dialog'; // Import the Delete dialog
import Image from 'next/image'; // Import Next Image

export default function ProductListAdmin() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        // Check for Firebase initialization error first
        if (firebaseInitializationError) {
            setError(`Firebase Initialization Error: ${firebaseInitializationError.message}. Cannot fetch products.`);
            setIsLoading(false);
            return;
        }

        async function loadProducts() {
            setIsLoading(true);
            setError(null); // Clear previous errors
            try {
                const fetchedProducts = await fetchProducts(100); // Fetch more for admin view
                setProducts(fetchedProducts);
            } catch (err) {
                // fetchProducts now handles internal errors and returns [],
                // but we might catch errors from ensureFirebaseServices if it's called again elsewhere
                console.error("Caught error during product fetch:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred while fetching products.");
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, []); // Run only on mount

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    const handleDialogClose = () => {
        setSelectedProduct(null);
        setIsEditDialogOpen(false);
        setIsDeleteDialogOpen(false);
        // Optionally re-fetch products after edit/delete
        // loadProducts(); // Consider efficiency, maybe just update state locally
    };

    if (isLoading) {
        return <ProductListSkeleton />;
    }

    if (error) {
        return (
             <Alert variant="destructive">
                 <AlertTitle>Error Loading Products</AlertTitle>
                 <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Existing Products</CardTitle>
                <CardDescription>Manage your current product inventory.</CardDescription>
            </CardHeader>
            <CardContent>
                {products.length === 0 ? (
                    <p className="text-center text-muted-foreground">No products found. Add some!</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="hidden md:table-cell">Price (KES)</TableHead>
                                <TableHead className="hidden md:table-cell">Stock</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                   <TableCell className="hidden sm:table-cell">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                                data-ai-hint={`${product.category.toLowerCase()} product thumbnail`}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.category}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{product.price.toFixed(2)}</TableCell>
                                    <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 justify-end">
                                            {/* <Button variant="ghost" size="icon" className="h-7 w-7" title="View Details">
                                                <Eye className="h-4 w-4" />
                                            </Button> */}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7"
                                                title="Edit Product"
                                                onClick={() => handleEditClick(product)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-7 w-7"
                                                title="Delete Product"
                                                onClick={() => handleDeleteClick(product)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            {/* Edit Product Dialog */}
            {selectedProduct && (
                <EditProductDialog
                    isOpen={isEditDialogOpen}
                    onClose={handleDialogClose}
                    product={selectedProduct}
                />
            )}

             {/* Delete Product Dialog */}
             {selectedProduct && (
                <DeleteProductDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={handleDialogClose}
                    product={selectedProduct}
                />
            )}
        </Card>
    );
}


// Skeleton Loader Component
function ProductListSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" /> {/* CardTitle */}
                <Skeleton className="h-4 w-64 mt-1" /> {/* CardDescription */}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell"><Skeleton className="h-5 w-12" /></TableHead>
                            <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                            <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableHead>
                            <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, index) => ( // Show 5 skeleton rows
                            <TableRow key={index}>
                                <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell> {/* Badge */}
                                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-12" /></TableCell>
                                <TableCell>
                                    <div className="flex gap-1 justify-end">
                                        <Skeleton className="h-7 w-7 rounded" />
                                        <Skeleton className="h-7 w-7 rounded" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
