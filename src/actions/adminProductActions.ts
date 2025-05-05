
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import { productSchema, type ProductFormData } from '@/lib/schemas/productSchema';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Define the shape of the return value for better type safety
type ActionResult =
    | { success: true; productId: string }
    | { success: false; error: string };

export async function addProductAction(formData: ProductFormData): Promise<ActionResult> {
    // 1. Validate the incoming data using Zod schema
    const validationResult = productSchema.safeParse(formData);

    if (!validationResult.success) {
        console.error("Product validation failed:", validationResult.error.flatten().fieldErrors);
        // Combine multiple errors into a single string, or handle more granularly
        const errorMessages = Object.entries(validationResult.error.flatten().fieldErrors)
                                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                                .join('; ');
        return { success: false, error: `Validation failed: ${errorMessages}` };
    }

    const validatedData = validationResult.data;

    try {
        // 2. Prepare data for Firestore (including server timestamp if needed)
        const productData = {
            ...validatedData,
            createdAt: serverTimestamp(), // Optional: Track creation time
            // Ensure numeric types are correctly handled (Zod coerce helps)
            price: Number(validatedData.price),
            stock: Number(validatedData.stock),
             // Handle potentially empty imageUrl
             imageUrl: validatedData.imageUrl || 'https://picsum.photos/seed/placeholder/400/300', // Use placeholder if empty
        };

        // 3. Add the document to the 'products' collection in Firestore
        const productsCollectionRef = collection(db, 'products');
        const docRef = await addDoc(productsCollectionRef, productData);

        console.log("Product added successfully with ID:", docRef.id);

        // 4. Revalidate the path to update cached data (optional but recommended)
        // This tells Next.js to refresh data for pages displaying products
        revalidatePath('/admin/products'); // Revalidate the admin products page
        revalidatePath('/'); // Revalidate the homepage (if it shows products)

        return { success: true, productId: docRef.id };

    } catch (error) {
        console.error("Error adding product to Firestore:", error);
        // Provide a generic error message or more specific based on the error type
        return { success: false, error: 'Failed to add product to the database. Please try again.' };
    }
}

// Add actions for updating and deleting products later
