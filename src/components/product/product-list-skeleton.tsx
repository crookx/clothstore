
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface ProductListSkeletonProps {
    count?: number; // Number of skeleton cards to show
}

export default function ProductListSkeleton({ count = 4 }: ProductListSkeletonProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(count)].map((_, index) => (
                <Card key={index} className="overflow-hidden rounded-lg shadow-md border border-transparent">
                    <CardHeader className="p-0 relative">
                        <Skeleton className="aspect-video w-full bg-muted" />
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-5 w-3/4 bg-muted" /> {/* Title */}
                        <Skeleton className="h-4 w-full bg-muted" /> {/* Description line 1 */}
                        <Skeleton className="h-4 w-5/6 bg-muted" /> {/* Description line 2 */}
                        <Skeleton className="h-6 w-1/3 bg-muted" /> {/* Price */}
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Skeleton className="h-10 w-full bg-muted" /> {/* Button */}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
