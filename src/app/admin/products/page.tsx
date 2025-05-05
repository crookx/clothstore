
import AddProductForm from '@/components/admin/add-product-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, List } from 'lucide-react'; // Icons for tabs

// Placeholder for Product List component (to be created later)
function ProductListAdminPlaceholder() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Existing Products</CardTitle>
                <CardDescription>Manage your current product inventory.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Product list component will be displayed here.</p>
                {/* You'll fetch and display products using a table or list here */}
            </CardContent>
        </Card>
    );
}


export default function AdminProductsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-primary">Product Management</h1>

            <Tabs defaultValue="add-product" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="add-product">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
                    </TabsTrigger>
                    <TabsTrigger value="view-products">
                        <List className="mr-2 h-4 w-4" /> View Products
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="add-product">
                    <AddProductForm />
                </TabsContent>

                <TabsContent value="view-products">
                    {/* Placeholder - Replace with the actual product list component */}
                    <ProductListAdminPlaceholder />
                </TabsContent>
            </Tabs>
        </div>
    );
}
