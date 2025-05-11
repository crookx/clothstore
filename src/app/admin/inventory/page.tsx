'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getLowStockProducts, updateProductStock } from '@/services/adminService';

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  sku: string;
  category: string;
  price: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const data = await getLowStockProducts(10);
      setProducts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load inventory',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleStockUpdate(productId: string, newStock: number) {
    try {
      await updateProductStock(productId, newStock);
      toast({
        title: 'Success',
        description: 'Stock updated successfully',
      });
      loadInventory();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update stock',
        variant: 'destructive',
      });
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary">Inventory Management</h1>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>KES {product.price}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock < 5 ? 'destructive' : 'default'}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="w-20"
                          defaultValue={product.stock}
                          onChange={(e) => {
                            const newStock = parseInt(e.target.value);
                            if (!isNaN(newStock) && newStock >= 0) {
                              handleStockUpdate(product.id, newStock);
                            }
                          }}
                        />
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}