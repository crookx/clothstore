'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, UserCog, Lock, Mail, Ban } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'customer' | 'manager';
    status: 'active' | 'suspended' | 'pending';
    lastLogin: Date;
    ordersCount: number;
}

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const handleImpersonateUser = async (userId: string) => {
        // Implementation for user impersonation with proper security checks
    };

    const handleStatusChange = async (userId: string, newStatus: string) => {
        // Implementation for updating user status
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
                <Button>Add New User</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                </Avatar>
                                <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                    {user.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{user.lastLogin.toLocaleDateString()}</TableCell>
                            <TableCell>{user.ordersCount}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <UserCog className="mr-2 h-4 w-4" />
                                            Edit Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Reset Password
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Email
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Ban className="mr-2 h-4 w-4" />
                                            Suspend Account
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}