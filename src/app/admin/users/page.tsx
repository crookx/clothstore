'use client';

import { useState, useEffect } from 'react';
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { UserRoleModal } from "@/components/admin/modals/UserRoleModal";
import { useToast } from "@/hooks/use-toast";
import { 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Shield 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: 'active' | 'blocked';
}

function ActionsCell({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-navy-800 border-navy-700">
        <DropdownMenuItem
          onClick={() => {/* handle role update */}}
          className="text-white hover:text-white/80 hover:bg-navy-700"
        >
          <Shield className="mr-2 h-4 w-4" />
          Change Role
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {/* handle status update */}}
          className="text-white hover:text-white/80 hover:bg-navy-700"
        >
          {user.status === 'active' ? (
            <>
              <UserX className="mr-2 h-4 w-4" />
              Block User
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Activate User
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns = [
  { 
    accessorKey: 'name', 
    header: 'Name' 
  },
  { 
    accessorKey: 'email', 
    header: 'Email' 
  },
  { 
    accessorKey: 'role', 
    header: 'Role' 
  },
  { 
    accessorKey: 'lastLogin', 
    header: 'Last Login' 
  },
  { 
    accessorKey: 'status', 
    header: 'Status' 
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: { row: { original: User } }) => (
      <ActionsCell user={row.original} />
    ),
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    }
  }

  async function updateUserRole(userId: string, newRole: string) {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) throw new Error('Failed to update user role');
      
      await fetchUsers(); // Refresh user list
      toast({
        title: "Success",
        description: "User role updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  }

  async function bulkUpdateUsers(action: 'block' | 'unblock') {
    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userIds: selectedUsers,
          action 
        })
      });
      
      if (!response.ok) throw new Error('Failed to update users');
      
      await fetchUsers(); // Refresh user list
      setSelectedUsers([]); // Clear selection
      toast({
        title: "Success",
        description: `Users ${action}ed successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} users`,
        variant: "destructive"
      });
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <div className="flex gap-4">
          {selectedUsers.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsRoleModalOpen(true)}
              >
                Update Roles
              </Button>
              <Button
                variant="destructive"
                onClick={() => bulkUpdateUsers('block')}
              >
                Block Selected
              </Button>
            </>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        onRowSelection={setSelectedUsers}
      />

      <UserRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onUpdate={updateUserRole}
        selectedUsers={selectedUsers}
      />
    </div>
  );
}