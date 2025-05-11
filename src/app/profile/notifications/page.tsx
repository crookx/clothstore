'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, MessageSquare, Tag } from 'lucide-react';

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    newArrivals: false,
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notification Preferences</h1>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <Label>Order Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your orders
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.orderUpdates}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, orderUpdates: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Tag className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <Label>Promotions</Label>
                <p className="text-sm text-muted-foreground">
                  Receive deals and promotional offers
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.promotions}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, promotions: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <Label>Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Subscribe to our newsletter
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.newsletter}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, newsletter: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <Label>New Arrivals</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new products
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.newArrivals}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, newArrivals: checked })
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
}