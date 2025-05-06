
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
import { Edit, Trash2, Eye, AlertCircle } from 'lucide-react'; // Added AlertCircle
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getFirebaseServices, firebaseInitializationError } from '@/lib/firebase/config'; // Import getFirebaseServices
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

     // Ref to track mounted state
     const isMounted = useState(true)[0]; // Using array destructuring to prevent re-render on ref change

    useEffect(() => {
         // Check for Firebase initialization error first
         if (firebaseInitializationError) {
             setError(`Firebase Initialization Error: ${firebaseInitializationError.message}. Cannot fetch products.`);
             setIsLoading(false);
             return;
         }

         // Double check if services are actually available ( belt-and-suspenders approach)
         if (!getFirebaseServices()) {
              setError("Core Firebase services are unavailable. Cannot fetch products.");
              setIsLoading(false);
              return;
         }

        let active = true; // Flag to prevent state updates on unmounted component

        async function loadProducts() {
             setIsLoading(true);
             setError(null);
             try {
                 const fetchedProducts = await fetchProducts(200); // Fetch more for admin view
                 if (!active) return; // Don't update state if component unmounted

                 if (fetchedProducts === null) {
                     // This indicates an error during fetch (logged in fetchProducts) or init error after first check
                     setError("Failed to load products. Check console for details.");
                     setProducts([]); // Set to empty array on failure
                 } else {
                     setProducts(fetchedProducts);
                 }
             } catch (err) {
                if (!active) return;
                 console.error("Error in ProductListAdmin fetch:", err);
                 setError(err instanceof Error ? err.message : "An unknown error occurred while fetching products.");
                 setProducts([]); // Set to empty array on error
             } finally {
                if (active) setIsLoading(false);
             }
         }

        loadProducts();

        return () => {
            active = false; // Set flag on unmount
        };
    }, [isMounted]); // Dependency array ensures this runs only once on mount


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
        // TODO: Implement a more efficient refresh mechanism
        // For now, re-fetch all products. Consider optimistic updates or targeted re-fetch later.
        // Re-fetch data after closing dialog (simple approach)
        async function reload() {
             setIsLoading(true);
             setError(null);
             try {
                 const fetchedProducts = await fetchProducts(200);
                 if (fetchedProducts === null) {
                      setError("Failed to reload products after update.");
                      setProducts([]);
                 } else {
                      setProducts(fetchedProducts);
                 }
             } catch (err) {
                 console.error("Error reloading products:", err);
                 setError("Failed to reload products after update.");
             } finally {
                  setIsLoading(false);
             }
        }
        reload();
    };

    if (isLoading) {
        return <ProductListSkeleton />;
    }

    // Display specific error if Firebase init failed
    if (firebaseInitializationError || error?.includes("Core Firebase services")) {
        return (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                 <AlertTitle>Configuration Error</AlertTitle>
                 <AlertDescription>{error || firebaseInitializationError?.message}</AlertDescription>
            </Alert>
        );
    }

    // Display general fetch error
     if (error) {
        return (
             <Alert variant="destructive">
                 <AlertCircle className="h-4 w-4" />
                 <AlertTitle>Error Loading Products</AlertTitle>
                 <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Existing Products ({products.length})</CardTitle>
                <CardDescription>Manage your current product inventory.</CardDescription>
            </CardHeader>
            <CardContent>
                {products.length === 0 && !isLoading ? (
                    <p className="text-center text-muted-foreground py-6">
                        No products found. Use the "Add New Product" tab to add inventory.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="hidden md:table-cell text-right">Price (KES)</TableHead>
                                    <TableHead className="hidden md:table-cell text-right">Stock</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                    <TableCell className="hidden sm:table-cell">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                                                <Image
                                                    // Use placeholder if imageUrl is potentially missing or invalid
                                                    src={product.imageUrl || 'https://picsum.photos/seed/placeholder/80/80'}
                                                    alt={product.name}
                                                    fill // Use fill instead of layout
                                                    sizes="80px" // Provide sizes hint
                                                    style={{ objectFit: 'cover' }} // Use style for objectFit
                                                    className="rounded-md"
                                                    data-ai-hint={`${product.category.toLowerCase()} product thumbnail`}
                                                    onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/placeholder/80/80'; }} // Fallback image on error
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium max-w-[200px] truncate" title={product.name}>
                                            {product.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-right">{product.price.toFixed(2)}</TableCell>
                                        <TableCell className="hidden md:table-cell text-right">{product.stock}</TableCell>
                                        <TableCell className="text-right">
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
                                                    variant="outline" // Changed to outline for less visual weight initially
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive border-destructive hover:bg-destructive/10" // Destructive outline style
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
                    </div>
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
                            <TableHead className="w-[80px] hidden sm:table-cell"><Skeleton className="h-5 w-12" /></TableHead>
                            <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                            <TableHead className="hidden md:table-cell text-right"><Skeleton className="h-5 w-20" /></TableHead>
                            <TableHead className="hidden md:table-cell text-right"><Skeleton className="h-5 w-16" /></TableHead>
                            <TableHead className="text-right"><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, index) => ( // Show 5 skeleton rows
                            <TableRow key={index}>
                                <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell> {/* Badge */}
                                <TableCell className="hidden md:table-cell text-right"><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell className="hidden md:table-cell text-right"><Skeleton className="h-5 w-12" /></TableCell>
                                <TableCell className="text-right">
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
