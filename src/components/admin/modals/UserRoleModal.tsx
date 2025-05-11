import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, newRole: string) => Promise<void>;
  selectedUsers: string[];
}

export function UserRoleModal({
  isOpen,
  onClose,
  onUpdate,
  selectedUsers
}: UserRoleModalProps) {
  const [newRole, setNewRole] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!newRole) return;
    
    setIsUpdating(true);
    try {
      await Promise.all(
        selectedUsers.map(userId => onUpdate(userId, newRole))
      );
      onClose();
    } catch (error) {
      console.error('Failed to update roles:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-navy-800 text-white">
        <DialogHeader>
          <DialogTitle>Update User Roles</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Select onValueChange={setNewRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select new role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={!newRole || isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}