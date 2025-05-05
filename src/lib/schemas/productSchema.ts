
import { z } from 'zod';

// Schema for validating product data when adding/editing
export const productSchema = z.object({
    name: z.string().min(3, { message: "Product name must be at least 3 characters long." }).max(100, { message: "Product name cannot exceed 100 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters long." }).max(500, { message: "Description cannot exceed 500 characters." }),
    price: z.coerce // Use coerce to handle string input from form
        .number({ invalid_type_error: "Price must be a number." })
        .positive({ message: "Price must be a positive number." })
        .finite({ message: "Price must be a valid number." }),
    category: z.string().min(1, { message: "Category is required." }),
    imageUrl: z.string().url({ message: "Please enter a valid image URL." }).or(z.literal("")), // Allow empty string or valid URL
    stock: z.coerce // Use coerce for string input
        .number({ invalid_type_error: "Stock must be a number." })
        .int({ message: "Stock must be a whole number." })
        .nonnegative({ message: "Stock cannot be negative." })
});

export type ProductFormData = z.infer<typeof productSchema>;
