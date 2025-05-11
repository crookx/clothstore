import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline, TimelineItem } from "@/components/ui/timeline";

interface ShippingDetails {
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    carrier: string;
    trackingNumber: string;
    status: string;
    updates: {
        date: Date;
        status: string;
        location: string;
    }[];
}

interface ShippingTabProps {
    shipping: ShippingDetails;
    onUpdateTracking: (tracking: { carrier: string; trackingNumber: string }) => void;
}

export default function ShippingTab({ shipping, onUpdateTracking }: ShippingTabProps) {
    const [trackingInfo, setTrackingInfo] = useState({
        carrier: shipping.carrier || '',
        trackingNumber: shipping.trackingNumber || ''
    });

    return (
        <div className="grid grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p>{shipping.address.street}</p>
                        <p>{shipping.address.city}, {shipping.address.state} {shipping.address.zipCode}</p>
                        <p>{shipping.address.country}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tracking Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="Carrier"
                                value={trackingInfo.carrier}
                                onChange={(e) => setTrackingInfo({
                                    ...trackingInfo,
                                    carrier: e.target.value
                                })}
                            />
                            <Input
                                placeholder="Tracking Number"
                                value={trackingInfo.trackingNumber}
                                onChange={(e) => setTrackingInfo({
                                    ...trackingInfo,
                                    trackingNumber: e.target.value
                                })}
                            />
                        </div>
                        <Button 
                            onClick={() => onUpdateTracking(trackingInfo)}
                            className="w-full"
                        >
                            Update Tracking
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Shipping Updates</CardTitle>
                </CardHeader>
                <CardContent>
                    <Timeline>
                        {shipping.updates.map((update, index) => (
                            <TimelineItem
                                key={index}
                                title={update.status}
                                date={update.date}
                                description={update.location}
                            />
                        ))}
                    </Timeline>
                </CardContent>
            </Card>
        </div>
    );
}