import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { Avatar } from "@/components/ui/avatar";

interface Review {
    id: string;
    productId: string;
    productName: string;
    customerName: string;
    customerAvatar: string;
    rating: number;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    response?: string;
}

export default function ReviewManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [response, setResponse] = useState('');

    const handleStatusUpdate = async (reviewId: string, status: Review['status']) => {
        // Implementation for updating review status
    };

    const handleResponse = async (reviewId: string) => {
        // Implementation for saving response
    };

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
                {reviews.map((review) => (
                    <Card 
                        key={review.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedReview(review)}
                    >
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-4">
                                    <Avatar src={review.customerAvatar} />
                                    <div>
                                        <h4 className="font-semibold">{review.customerName}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {review.productName}
                                        </p>
                                        <StarRating value={review.rating} readonly />
                                    </div>
                                </div>
                                <Badge variant={
                                    review.status === 'approved' ? 'secondary' :
                                    review.status === 'rejected' ? 'destructive' : 'default'
                                }>
                                    {review.status}
                                </Badge>
                            </div>
                            
                            <p className="mt-4">{review.content}</p>
                            
                            {review.response && (
                                <div className="mt-4 pl-4 border-l-2">
                                    <p className="text-sm font-medium">Store Response:</p>
                                    <p className="text-sm">{review.response}</p>
                                </div>
                            )}
                            
                            <div className="mt-4 flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                >
                                    Reject
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(review.id, 'approved')}
                                >
                                    Approve
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedReview && (
                <Card className="sticky top-4">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Respond to Review</h3>
                        <Textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Type your response..."
                            rows={6}
                        />
                        <Button 
                            className="w-full mt-4"
                            onClick={() => handleResponse(selectedReview.id)}
                        >
                            Post Response
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}