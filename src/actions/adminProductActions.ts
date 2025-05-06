
'use server';

import { revalidatePath } from 'next/cache';
import { getFirebaseServices } from '@/lib/firebase/config'; // Import the function to get services
import { productSchema, type ProductFormData } from '@/lib/schemas/productSchema';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
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

    // Ensure Firebase services are ready before proceeding
    const services = getFirebaseServices();
    if (!services) {
        const errorMsg = "Database connection failed. Cannot add product.";
        console.error(errorMsg);
        return { success: false, error: errorMsg };
    }
    const { db } = services;

    try {
        // 2. Prepare data for Firestore
        const productData = {
            ...validatedData,
            // Ensure numeric types directly (validation already coerces)
            price: validatedData.price,
            stock: validatedData.stock,
            // Handle potentially empty imageUrl
            imageUrl: validatedData.imageUrl || 'https://picsum.photos/seed/placeholder/400/300', // Use placeholder if empty
            createdAt: serverTimestamp(), // Optional: Track creation time using server timestamp
        };

        // 3. Add the document to the 'products' collection
        const productsCollectionRef = collection(db, 'products');
        const docRef = await addDoc(productsCollectionRef, productData);

        console.log("Product added successfully with ID:", docRef.id);

        // 4. Revalidate paths (important for cache invalidation)
        revalidatePath('/admin/products'); // Revalidate admin product list
        revalidatePath('/'); // Revalidate homepage
        revalidatePath('/product'); // Revalidate general product listing page (if exists)

        return { success: true, productId: docRef.id };

    } catch (error) {
        console.error("Error adding product to Firestore:", error);
        let errorMessage = 'Failed to add product. Please try again.';
        if (error instanceof Error) {
            if (error.message.includes("permission")) {
                 errorMessage = 'Permission denied. You might not have the necessary rights to add products.';
            }
             // Add more specific Firestore error checks if needed (e.g., quota exceeded)
        }
        return { success: false, error: errorMessage };
    }
}

// --- Update Product Action ---
// Define a specific type for the partial update data
type PartialProductUpdate = Partial<Omit<Product, 'id' | 'createdAt'>>; // Allow updating most fields

export async function updateProductAction(productId: string, formData: Partial<ProductFormData>): Promise<ActionResult> {
     // Validate only the fields being updated (optional but recommended)
     // For complex partial validation, you might need a separate Zod schema or manual checks.
     // Simple check for at least one field being present:
     if (Object.keys(formData).length === 0) {
          return { success: false, error: "No fields provided for update." };
     }

     // Ensure Firebase services are ready
     const services = getFirebaseServices();
     if (!services) {
        const errorMsg = "Database connection failed. Cannot update product.";
        console.error(errorMsg);
        return { success: false, error: errorMsg };
     }
     const { db } = services;

    try {
        const productRef = doc(db, 'products', productId);

        // Prepare update data, converting specific fields if necessary
        // Ensure only provided fields are included
        const updateData: PartialProductUpdate = {};
        if (formData.name !== undefined) updateData.name = formData.name;
        if (formData.description !== undefined) updateData.description = formData.description;
        if (formData.price !== undefined) updateData.price = Number(formData.price); // Coerce/validate price
        if (formData.stock !== undefined) updateData.stock = Number(formData.stock); // Coerce/validate stock
        if (formData.category !== undefined) updateData.category = formData.category;
        if (formData.imageUrl !== undefined) {
            // Use placeholder if imageUrl is explicitly set to empty string during update
            updateData.imageUrl = formData.imageUrl || 'https://picsum.photos/seed/placeholder/400/300';
        }
        // Add 'updatedAt' timestamp if desired
        // updateData.updatedAt = serverTimestamp();


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
             if (error.message.includes("permission")) {
                  errorMessage = 'Permission denied. You might not have the necessary rights to update products.';
             } else if (error.message.includes("No document to update") || (error as any).code === 'not-found') {
                  errorMessage = 'Product not found.';
             }
             // Add more specific Firestore error checks if needed
        }
        return { success: false, error: errorMessage };
    }
}


// --- Delete Product Action ---
export async function deleteProductAction(productId: string): Promise<Omit<ActionResult, 'productId'>> {
    // Ensure Firebase services are ready
    const services = getFirebaseServices();
    if (!services) {
       const errorMsg = "Database connection failed. Cannot delete product.";
       console.error(errorMsg);
       return { success: false, error: errorMsg };
    }
    const { db } = services;

    try {
        const productRef = doc(db, 'products', productId);
        await deleteDoc(productRef);

        console.log("Product deleted successfully with ID:", productId);

        // Revalidate paths
        revalidatePath('/admin/products');
        revalidatePath('/');
         revalidatePath('/product'); // Revalidate product listing page
         revalidatePath(`/product/${productId}`); // Invalidate deleted product's page cache

        return { success: true }; // No productId needed on success

    } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
         let errorMessage = 'Failed to delete product. Please try again.';
         if (error instanceof Error) {
             if (error.message.includes("permission")) {
                  errorMessage = 'Permission denied. You might not have the necessary rights to delete products.';
             } else if ((error as any).code === 'not-found') {
                 // Handle case where product might already be deleted
                 console.warn(`Attempted to delete non-existent product: ${productId}`);
                 return { success: true }; // Consider this a success if the goal is deletion
             }
             // Add more specific Firestore error checks if needed
         }
        return { success: false, error: errorMessage };
    }
}
