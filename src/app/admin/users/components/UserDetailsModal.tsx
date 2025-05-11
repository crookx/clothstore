'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/user';

interface UserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: 'active' | 'suspended' | 'pending') => void;
  onPasswordReset: () => void;
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onStatusChange,
  onPasswordReset,
}: UserDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant={user.accountStatus === 'active' ? 'default' : 'destructive'}>
                  {user.accountStatus}
                </Badge>
                <div className="space-x-2">
                  <Button onClick={onPasswordReset} variant="outline">
                    Reset Password
                  </Button>
                  <Button 
                    onClick={() => onStatusChange(user.accountStatus === 'active' ? 'suspended' : 'active')}
                    variant={user.accountStatus === 'active' ? 'destructive' : 'default'}
                  >
                    {user.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge>{user.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
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
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <Badge>{order.status}</Badge>
                          <p className="text-right mt-1">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No orders found</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="text-center text-muted-foreground">
              Activity log coming soon
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}