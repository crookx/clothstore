'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Order, Address } from '@/types/user';
import { useState } from 'react';
import { IconButton } from '@/components/ui/icon-button';
import { Edit, Save, X } from 'lucide-react';

interface UserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (userId: string, data: Partial<User>) => Promise<void>;
  onResetPassword: (userId: string) => Promise<void>;
  onUpdateStatus: (userId: string, status: User['accountStatus']) => Promise<void>;
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  onResetPassword,
  onUpdateStatus,
}: UserDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdateUser(user.id, editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setLoading(true);
      await onUpdateStatus(
        user.id,
        user.accountStatus === 'active' ? 'suspended' : 'active'
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      await onResetPassword(user.id);
    } catch (error) {
      console.error('Failed to reset password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            User Details
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
              {isEditing && (
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <Badge 
                  variant={user.accountStatus === 'active' ? 'default' : 'destructive'}
                >
                  {user.accountStatus}
                </Badge>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={handlePasswordReset}
                    disabled={loading}
                  >
                    Reset Password
                  </Button>
                  <Button
                    variant={user.accountStatus === 'active' ? 'destructive' : 'default'}
                    onClick={handleStatusChange}
                    disabled={loading}
                  >
                    {user.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editedUser.email}
                    disabled={!isEditing || loading}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={editedUser.name || ''}
                    disabled={!isEditing || loading}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={editedUser.phone || ''}
                    disabled={!isEditing || loading}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Joined</Label>
                  <Input
                    value={new Date(user.createdAt).toLocaleDateString()}
                    disabled
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              {user.orders && user.orders.length > 0 ? (
                user.orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'cancelled' ? 'destructive' :
                            'secondary'
                          }>
                            {order.status}
                          </Badge>
                          <p className="text-right mt-1">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">No orders found</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="addresses">
            <div className="space-y-4">
              {user.addresses && (user.addresses.shipping.length > 0 || user.addresses.billing.length > 0) ? (
                [...user.addresses.shipping, ...user.addresses.billing].map((address) => (
                  <Card key={address.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <Badge variant={address.type === 'shipping' ? 'default' : 'secondary'}>
                            {address.type}
                          </Badge>
                          {address.isDefault && (
                            <Badge variant="outline" className="ml-2">Default</Badge>
                          )}
                          <p className="mt-2">
                            {address.street}<br />
                            {address.city}, {address.state} {address.postalCode}<br />
                            {address.country}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">No addresses found</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}