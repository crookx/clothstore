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
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, AlertCircle, Download, Archive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFirebaseServices, firebaseInitializationError } from '@/lib/firebase/config';
import { useToast } from "@/components/ui/use-toast";
import EditProductDialog from './edit-product-dialog';
import DeleteProductDialog from './delete-product-dialog';
import Image from 'next/image';
import { PLACEHOLDER_IMAGE_URL } from '@/lib/constants';

export default function ProductListAdmin() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [sortColumn, setSortColumn] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { toast } = useToast();

    const handleImageError = (failedSrc: string) => {
        setFailedImages(prev => new Set(prev).add(failedSrc));
    };

    const getImageUrl = (product: Product) => {
        const imageUrl = product.imageUrls?.[0] || PLACEHOLDER_IMAGE_URL;
        return failedImages.has(imageUrl) ? PLACEHOLDER_IMAGE_URL : imageUrl;
    };

    useEffect(() => {
        if (firebaseInitializationError) {
            setError(`Firebase Initialization Error: ${firebaseInitializationError.error?.message}. Cannot fetch products.`);
            setIsLoading(false);
            return;
        }

        if (!getFirebaseServices()) {
            setError("Core Firebase services are unavailable. Cannot fetch products.");
            setIsLoading(false);
            return;
        }

        let active = true;

        async function loadProducts() {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedProducts = await fetchProducts();
                if (!active) return;

                if (fetchedProducts === null) {
                    setError("Failed to load products. Check console for details.");
                    setProducts([]);
                } else {
                    setProducts(fetchedProducts);
                }
            } catch (err) {
                if (!active) return;
                console.error("Error in ProductListAdmin fetch:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred while fetching products.");
                setProducts([]);
            } finally {
                if (active) setIsLoading(false);
            }
        }

        loadProducts();

        return () => {
            active = false;
        };
    }, []);

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

        async function reload() {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedProducts = await fetchProducts();
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

    // Handle bulk selection
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProducts(new Set(products.map(p => p.id)));
        } else {
            setSelectedProducts(new Set());
        }
    };

    const handleSelectProduct = (productId: string, checked: boolean) => {
        const newSelected = new Set(selectedProducts);
        if (checked) {
            newSelected.add(productId);
        } else {
            newSelected.delete(productId);
        }
        setSelectedProducts(newSelected);
    };

    // Bulk actions
    const handleBulkAction = async (action: 'export' | 'archive' | 'delete' | 'publish' | 'unpublish') => {
        if (selectedProducts.size === 0) return;
        
        try {
            const response = await fetch('/api/products/bulk', {
                method: 'POST',
                body: JSON.stringify({
                    action,
                    productIds: Array.from(selectedProducts)
                })
            });

            if (!response.ok) throw new Error('Bulk action failed');
            
            toast({
                title: "Success",
                description: `${action} completed successfully`
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred"
            });
        }
    };

    const filteredProducts = products.filter((product) => {
        const searchTerm = searchQuery.toLowerCase();
        const nameMatch = product.name?.toLowerCase().includes(searchTerm) ?? false;
        const categoryMatch = product.category?.toLowerCase().includes(searchTerm) ?? false;
        const descriptionMatch = product.description?.toLowerCase().includes(searchTerm) ?? false;
        const priceMatch = product.price?.toString().includes(searchTerm) ?? false;

        return nameMatch || categoryMatch || descriptionMatch || priceMatch;
    });

    if (isLoading) {
        return <ProductListSkeleton />;
    }

    if (firebaseInitializationError || error?.includes("Core Firebase services")) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Error</AlertTitle>
                <AlertDescription>{error || firebaseInitializationError?.error?.message}</AlertDescription>
            </Alert>
        );
    }

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
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Existing Products ({filteredProducts.length})</CardTitle>
                        <CardDescription>Manage your current product inventory.</CardDescription>
                    </div>
                    {selectedProducts.size > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {selectedProducts.size} selected
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Bulk Actions
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Selected
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                                        <Archive className="w-4 h-4 mr-2" />
                                        Archive Selected
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                                        Delete Selected
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleBulkAction('publish')}>
                                        Publish Selected
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleBulkAction('unpublish')}>
                                        Unpublish Selected
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {filteredProducts.length === 0 && !isLoading ? (
                    <p className="text-center text-muted-foreground py-6">
                        No products found. Use the "Add New Product" tab to add inventory.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px]">
                                        <Checkbox
                                            checked={selectedProducts.size === filteredProducts.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="hidden md:table-cell text-right">Price (KES)</TableHead>
                                    <TableHead className="hidden md:table-cell text-right">Stock</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedProducts.has(product.id)}
                                                onCheckedChange={(checked) => 
                                                    handleSelectProduct(product.id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                                                <Image
                                                    src={getImageUrl(product)}
                                                    alt={product.name || ''}
                                                    fill
                                                    sizes="80px"
                                                    style={{ objectFit: 'cover' }}
                                                    className="rounded-md"
                                                    data-ai-hint={`${product.category?.toLowerCase() || 'product'} thumbnail`}
                                                    onError={() => handleImageError(product.imageUrls?.[0] || PLACEHOLDER_IMAGE_URL)}
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
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive border-destructive hover:bg-destructive/10"
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

            {selectedProduct && (
                <EditProductDialog
                    isOpen={isEditDialogOpen}
                    onClose={handleDialogClose}
                    product={selectedProduct}
                />
            )}

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

// Helper functions for CSV export
function convertToCSV(data: any[]) {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header]));
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function ProductListSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-1" />
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
                        {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
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
