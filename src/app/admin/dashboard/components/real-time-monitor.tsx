import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RealTimeEvent {
    id: string;
    type: 'order' | 'user' | 'stock' | 'review';
    message: string;
    timestamp: Date;
}

export default function RealTimeMonitor() {
    const [events, setEvents] = useState<RealTimeEvent[]>([]);

    useEffect(() => {
        // Implementation for WebSocket connection
        const ws = new WebSocket('wss://your-api/realtime');
        
        ws.onmessage = (event) => {
            const newEvent = JSON.parse(event.data);
            setEvents(prev => [newEvent, ...prev].slice(0, 50));
        };

        return () => ws.close();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Real-Time Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-muted"
                            >
                                <div className="flex items-center gap-2">
                                    <Badge variant={
                                        event.type === 'order' ? 'default' :
                                        event.type === 'user' ? 'secondary' :
                                        event.type === 'stock' ? 'destructive' : 'outline'
                                    }>
                                        {event.type}
                                    </Badge>
                                    <span>{event.message}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {event.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}