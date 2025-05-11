import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";

interface Ticket {
    id: string;
    subject: string;
    customerName: string;
    customerEmail: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    messages: {
        id: string;
        content: string;
        sender: 'customer' | 'support';
        timestamp: Date;
    }[];
    createdAt: Date;
    assignedTo?: string;
}

export default function TicketManager() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [reply, setReply] = useState('');

    const handleStatusUpdate = async (ticketId: string, status: Ticket['status']) => {
        // Implementation for updating ticket status
    };

    const handleReply = async (ticketId: string) => {
        // Implementation for sending reply
    };

    const handleAssign = async (ticketId: string, agentId: string) => {
        // Implementation for assigning ticket
    };

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
                {tickets.map((ticket) => (
                    <Card
                        key={ticket.id}
                        className={`p-4 cursor-pointer ${
                            selectedTicket?.id === ticket.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedTicket(ticket)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold">{ticket.subject}</h4>
                                <p className="text-sm text-muted-foreground">
                                    {ticket.customerName}
                                </p>
                            </div>
                            <Badge variant={
                                ticket.priority === 'urgent' ? 'destructive' :
                                ticket.priority === 'high' ? 'secondary' : 'default'
                            }>
                                {ticket.priority}
                            </Badge>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                                {ticket.createdAt.toLocaleString()}
                            </span>
                            <Badge variant={
                                ticket.status === 'open' ? 'default' :
                                ticket.status === 'in-progress' ? 'secondary' :
                                ticket.status === 'resolved' ? 'outline' : 'destructive'
                            }>
                                {ticket.status}
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>

            {selectedTicket && (
                <div className="col-span-2 space-y-4">
                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {selectedTicket.subject}
                                </h2>
                                <p className="text-muted-foreground">
                                    {selectedTicket.customerEmail}
                                </p>
                            </div>
                            <Select
                                value={selectedTicket.status}
                                onValueChange={(value) => 
                                    handleStatusUpdate(selectedTicket.id, value as Ticket['status'])
                                }
                            >
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            {selectedTicket.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.sender === 'support' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className={`max-w-[70%] p-4 rounded-lg ${
                                        message.sender === 'support' 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted'
                                    }`}>
                                        <p>{message.content}</p>
                                        <span className="text-xs opacity-70">
                                            {message.timestamp.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <Textarea
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type your reply..."
                                rows={4}
                            />
                            <Button 
                                className="mt-2"
                                onClick={() => handleReply(selectedTicket.id)}
                            >
                                Send Reply
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}