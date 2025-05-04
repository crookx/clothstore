// src/app/order-confirmation/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Package, AlertCircle, ExternalLink } from 'lucide-react'; // Added ExternalLink
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// --- Internal Component to access searchParams ---
// This component is wrapped in Suspense because useSearchParams() can only be used in Client Components.
function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id'); // Get order ID from query parameter '?id=...'

    // --- Comment for User: Future Enhancement - Fetch Order Details ---
    // Currently, this page only confirms based on the ID in the URL.
    // For a production app, you should ideally:
    // 1. Create a server-side function/API route (`/api/orders/[orderId]`) that fetches
    //    the order details securely from Firestore using the `orderId`.
    //    - IMPORTANT: Ensure only the authenticated user who placed the order (or an admin)
    //      can fetch these details (check `userId` field in the order document).
    // 2. Call this API route from this component (using `useEffect` and `useState`)
    //    to get and display actual order details (items, total, shipping address, status).
    // 3. Handle loading and error states during the fetch.
    // const [orderDetails, setOrderDetails] = useState<any | null>(null); // Replace 'any' with your Order type
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);
    //
    // useEffect(() => {
    //   if (orderId) {
    //     fetch(`/api/orders/${orderId}`) // Your API endpoint
    //       .then(res => { if (!res.ok) throw new Error('Order not found or access denied'); return res.json(); })
    //       .then(data => setOrderDetails(data))
    //       .catch(err => setError(err.message))
    //       .finally(() => setLoading(false));
    //   } else {
    //     setLoading(false); // No ID, nothing to load
    //   }
    // }, [orderId]);
    // --- End Future Enhancement Comment ---


    // --- Render based on orderId presence ---
    if (!orderId) {
        // --- State: Invalid/Missing Order ID ---
        return (
             <Card className="w-full max-w-lg mx-auto mt-10 text-center border-destructive shadow-md">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center justify-center gap-2">
                       <AlertCircle className="h-6 w-6" /> Invalid Confirmation Link
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        No order ID was found in the URL. Please check the link you used or visit your order history.
                    </p>
                    <Link href="/" passHref>
                        <Button>Return to Shop</Button>
                    </Link>
                </CardContent>
             </Card>
        );
    }

    // --- State: Order ID Found (Basic Confirmation) ---
    // --- Comment: Replace this section when fetching real order details ---
    return (
        <Card className="w-full max-w-lg mx-auto mt-10 text-center shadow-lg border-green-500/50">
            <CardHeader className="bg-green-50 dark:bg-green-950/30 rounded-t-lg py-8"> {/* Added background color */}
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-3" />
                <CardTitle className="text-2xl font-semibold text-primary">Order Successfully Placed!</CardTitle>
                <CardDescription className="text-muted-foreground pt-1">
                    Your cosmic goodies are being prepared for launch!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-6 py-6"> {/* Added padding */}
                <p className="text-base">
                    Your Order Confirmation ID:
                    <br />
                    <strong className="font-mono text-lg text-accent break-all block mt-1">{orderId}</strong> {/* Show full ID, ensure it wraps */}
                </p>
                <p className="text-muted-foreground text-sm">
                    You should receive a confirmation email shortly with your order details. You can also track your order status in your account (once implemented).
                </p>

                {/* --- Placeholder for Fetched Order Details --- */}
                {/* {loading && <OrderDetailsSkeleton />}
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {orderDetails && (
                     <div className="text-left border rounded-md p-4 bg-muted/50">
                        <h4 className="font-semibold mb-2">Order Summary (Placeholder)</h4>
                        <p>Total: ${orderDetails.total.toFixed(2)}</p>
                        <p>Items: {orderDetails.items.map(item => item.name).join(', ')}</p>
                        <p>Shipping To: {orderDetails.shippingInfo.firstName}...</p>
                     </div>
                 )} */}
                 {/* --- End Placeholder --- */}

            </CardContent>
            <CardFooter className="bg-muted/50 rounded-b-lg px-6 py-4 flex flex-col sm:flex-row justify-center items-center gap-3"> {/* Added bg, flex centering */}
                 <Link href="/" passHref>
                    <Button variant="outline" className="w-full sm:w-auto">
                         <Package className="mr-2 h-4 w-4" /> Continue Shopping
                    </Button>
                 </Link>
                 {/* --- Comment: Link to Order History Page (Future) --- */}
                  {/* <Link href="/account/orders" passHref>
                    <Button className="w-full sm:w-auto">
                        <ExternalLink className="mr-2 h-4 w-4" /> View Order History
                     </Button>
                  </Link> */}
            </CardFooter>
        </Card>
    );
}

// --- Main Page Component ---
// Wraps the content in Suspense to handle useSearchParams on the client.
export default function OrderConfirmationPage() {
    return (
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-theme(spacing.28))]">
            <Suspense fallback={<OrderConfirmationSkeleton />}>
                <OrderConfirmationContent />
            </Suspense>
        </div>
    );
}


// --- Skeleton Loader Component ---
function OrderConfirmationSkeleton() {
     return (
         <Card className="w-full max-w-lg mx-auto mt-10 text-center shadow-lg animate-pulse">
             <CardHeader className="py-8">
                 <Skeleton className="h-16 w-16 rounded-full mx-auto mb-3 bg-muted" />
                 <Skeleton className="h-7 w-48 mx-auto bg-muted" />
                 <Skeleton className="h-4 w-64 mx-auto mt-2 bg-muted" />
             </CardHeader>
             <CardContent className="space-y-5 px-6 py-6">
                 <Skeleton className="h-5 w-3/4 mx-auto bg-muted" />
                 <Skeleton className="h-6 w-full max-w-xs mx-auto bg-muted" />
                 <Skeleton className="h-4 w-full max-w-sm mx-auto bg-muted" />
                 <Skeleton className="h-4 w-full max-w-xs mx-auto bg-muted" />
             </CardContent>
             <CardFooter className="bg-muted/50 rounded-b-lg px-6 py-4 flex flex-col sm:flex-row justify-center items-center gap-3">
                 <Skeleton className="h-10 w-36 rounded-md bg-muted" />
                 <Skeleton className="h-10 w-36 rounded-md bg-muted" />
             </CardFooter>
         </Card>
     );
}

// --- Optional: Skeleton for Order Details Section ---
function OrderDetailsSkeleton() {
    return (
        <div className="text-left border rounded-md p-4 bg-muted/50 space-y-3">
            <Skeleton className="h-5 w-32 mb-2 bg-muted-foreground/20" />
            <Skeleton className="h-4 w-48 bg-muted-foreground/20" />
            <Skeleton className="h-4 w-full max-w-xs bg-muted-foreground/20" />
            <Skeleton className="h-4 w-36 bg-muted-foreground/20" />
        </div>
    );
}