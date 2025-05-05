
'use server';

import { revalidatePath } from 'next/cache';
import { ensureFirebaseServices } from '@/lib/firebase/config'; // Import the helper
import { productSchema, type ProductFormData } from '@/lib/schemas/productSchema';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Product } from '@/types/product'; // Import Product type

// Define the shape of the return value for better type safety
type ActionResult =
    | { success: true; productId: string }
    | { success: false; error: string };

export async function addProductAction(formData: ProductFormData): Promise<ActionResult> {
    // 1. Validate the incoming data using Zod schema
    const validationResult = productSchema.safeParse(formData);

    if (!validationResult.success) {
        console.error("Product validation failed:", validationResult.error.flatten().fieldErrors);
        const errorMessages = Object.entries(validationResult.error.flatten().fieldErrors)
                                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                                .join('; ');
        return { success: false, error: `Validation failed: ${errorMessages}` };
    }

    const validatedData = validationResult.data;
    let db;

    try {
        // Ensure Firebase services are ready before proceeding
        const services = ensureFirebaseServices();
        db = services.db;

        // 2. Prepare data for Firestore
        const productData = {
            ...validatedData,
            createdAt: serverTimestamp(), // Optional: Track creation time
            price: Number(validatedData.price), // Ensure numeric types
            stock: Number(validatedData.stock), // Ensure numeric types
             // Handle potentially empty imageUrl
             imageUrl: validatedData.imageUrl || 'https://picsum.photos/seed/placeholder/400/300', // Use placeholder if empty
        };

        // 3. Add the document to the 'products' collection
        const productsCollectionRef = collection(db, 'products');
        const docRef = await addDoc(productsCollectionRef, productData);

        console.log("Product added successfully with ID:", docRef.id);

        // 4. Revalidate paths
        revalidatePath('/admin/products');
        revalidatePath('/');
        revalidatePath('/product'); // Assuming a product listing page

        return { success: true, productId: docRef.id };

    } catch (error) {
        console.error("Error adding product:", error);
        let errorMessage = 'Failed to add product. Please try again.';
        if (error instanceof Error) {
            if (error.message.includes("Firebase services")) { // Catch error from ensureFirebaseServices
               errorMessage = 'Database connection failed. Please try again later.';
            } else if (error.message.includes("permission")) {
                 errorMessage = 'You do not have permission to add products.';
            }
             // Add more specific Firestore error checks if needed
        }
        return { success: false, error: errorMessage };
    }
}

// --- Update Product Action ---
export async function updateProductAction(productId: string, formData: Partial<ProductFormData>): Promise<ActionResult> {
     // Validate only the fields being updated (optional but good practice)
     // For simplicity, we'll assume valid partial data for now,
     // but you might want to create a partial Zod schema or validate differently.

    let db;
    try {
        const services = ensureFirebaseServices();
        db = services.db;

        const productRef = doc(db, 'products', productId);

        // Prepare update data, converting specific fields if necessary
        const updateData: Partial<Product> = { ...formData };
        if (formData.price !== undefined) updateData.price = Number(formData.price);
        if (formData.stock !== undefined) updateData.stock = Number(formData.stock);
        // Use placeholder if imageUrl is explicitly set to empty string during update
        if (formData.imageUrl === "") updateData.imageUrl = 'https://picsum.photos/seed/placeholder/400/300';


        await updateDoc(productRef, updateData);

        console.log("Product updated successfully with ID:", productId);

        // Revalidate paths
        revalidatePath('/admin/products');
        revalidatePath(`/product/${productId}`); // Revalidate specific product page if it exists
        revalidatePath('/');
         revalidatePath('/product'); // Revalidate product listing page

        return { success: true, productId: productId };

    } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        let errorMessage = 'Failed to update product. Please try again.';
        if (error instanceof Error) {
             if (error.message.includes("Firebase services")) {
               errorMessage = 'Database connection failed. Please try again later.';
             } else if (error.message.includes("permission")) {
                  errorMessage = 'You do not have permission to update products.';
             } else if (error.message.includes("No document to update")) {
                  errorMessage = 'Product not found.';
             }
             // Add more specific Firestore error checks if needed
        }
        return { success: false, error: errorMessage };
    }
}


// --- Delete Product Action ---
export async function deleteProductAction(productId: string): Promise<Omit<ActionResult, 'productId'>> {
    let db;
    try {
        const services = ensureFirebaseServices();
        db = services.db;

        const productRef = doc(db, 'products', productId);
        await deleteDoc(productRef);

        console.log("Product deleted successfully with ID:", productId);

        // Revalidate paths
        revalidatePath('/admin/products');
        revalidatePath('/');
         revalidatePath('/product'); // Revalidate product listing page
         // No specific product page to revalidate after deletion

        return { success: true };

    } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
         let errorMessage = 'Failed to delete product. Please try again.';
         if (error instanceof Error) {
             if (error.message.includes("Firebase services")) {
                errorMessage = 'Database connection failed. Please try again later.';
             } else if (error.message.includes("permission")) {
                  errorMessage = 'You do not have permission to delete products.';
             }
             // Add more specific Firestore error checks if needed
         }
        return { success: false, error: errorMessage };
    }
}
