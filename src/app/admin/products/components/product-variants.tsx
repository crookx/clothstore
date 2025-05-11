'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, X } from 'lucide-react';

interface Variant {
    id: string;
    size: string;
    color: string;
    sku: string;
    stock: number;
    price: number;
}

interface ProductVariantsProps {
    variants: Variant[];
    onUpdate: (variants: Variant[]) => void;
}

export default function ProductVariants({ variants, onUpdate }: ProductVariantsProps) {
    const [localVariants, setLocalVariants] = useState<Variant[]>(variants);

    const addVariant = () => {
        const newVariant: Variant = {
            id: crypto.randomUUID(),
            size: '',
            color: '',
            sku: '',
            stock: 0,
            price: 0
        };
        setLocalVariants([...localVariants, newVariant]);
    };

    const removeVariant = (id: string) => {
        setLocalVariants(localVariants.filter(v => v.id !== id));
        onUpdate(localVariants.filter(v => v.id !== id));
    };

    const updateVariant = (id: string, field: keyof Variant, value: string | number) => {
        const updated = localVariants.map(v => 
            v.id === id ? { ...v, [field]: value } : v
        );
        setLocalVariants(updated);
        onUpdate(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Product Variants</h3>
                <Button onClick={addVariant} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant
                </Button>
            </div>
            
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Size</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {localVariants.map((variant) => (
                        <TableRow key={variant.id}>
                            <TableCell>
                                <Input
                                    value={variant.size}
                                    onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                                    placeholder="Size"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={variant.color}
                                    onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                                    placeholder="Color"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={variant.sku}
                                    onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                                    placeholder="SKU"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value))}
                                    placeholder="Stock"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value))}
                                    placeholder="Price"
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeVariant(variant.id)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}