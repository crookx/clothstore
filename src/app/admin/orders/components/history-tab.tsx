import { format } from 'date-fns';
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HistoryEvent {
    id: string;
    date: Date;
    type: 'status_change' | 'note' | 'payment' | 'shipping';
    description: string;
    user: {
        name: string;
        avatar: string;
    };
    metadata?: Record<string, any>;
}

interface HistoryTabProps {
    events: HistoryEvent[];
}

export default function HistoryTab({ events }: HistoryTabProps) {
    const getEventBadge = (type: HistoryEvent['type']) => {
        const badges = {
            status_change: { label: 'Status Update', variant: 'default' as const },
            note: { label: 'Note', variant: 'secondary' as const },
            payment: { label: 'Payment', variant: 'default' as const },
            shipping: { label: 'Shipping', variant: 'outline' as const }
        };
        return badges[type] || { label: type, variant: 'default' };
    };

    return (
        <Timeline>
            {events.map((event) => {
                const badge = getEventBadge(event.type);
                
                return (
                    <TimelineItem
                        key={event.id}
                        date={event.date}
                        icon={
                            <Avatar
                                src={event.user.avatar}
                                fallback={event.user.name}
                                className="h-8 w-8"
                            />
                        }
                        title={
                            <div className="flex items-center gap-2">
                                <span>{event.user.name}</span>
                                <Badge variant={badge.variant}>
                                    {badge.label}
                                </Badge>
                            </div>
                        }
                        description={event.description}
                    />
                );
            })}
        </Timeline>
    );
}