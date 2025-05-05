
// import AddProductForm from '@/components/admin/add-product-form';
import AddProductForm from './components/add-product-form'; // Corrected path
import ProductListAdmin from './components/product-list-admin'; // Import the actual list component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, List } from 'lucide-react'; // Icons for tabs


export default function AdminProductsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-primary">Product Management</h1>

            <Tabs defaultValue="view-products" className="w-full"> {/* Default to view */}
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
                     {/* Use the actual Product List Admin component */}
                     <ProductListAdmin />
                </TabsContent>
            </Tabs>
        </div>
    );
}
