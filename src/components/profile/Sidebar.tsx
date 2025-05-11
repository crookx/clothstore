'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Star,
  CreditCard,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

const navigation = [
  { name: 'Overview', href: '/profile', icon: User },
  { name: 'Orders', href: '/profile/orders', icon: ShoppingBag },
  { name: 'Addresses', href: '/profile/addresses', icon: MapPin },
  { name: 'Wishlist', href: '/profile/wishlist', icon: Heart },
  { name: 'Reviews', href: '/profile/reviews', icon: Star },
  { name: 'Payment Methods', href: '/profile/payment', icon: CreditCard },
  { name: 'Notifications', href: '/profile/notifications', icon: Bell },
  { name: 'Settings', href: '/profile/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="w-full md:w-64 space-y-6">
      {/* Profile Summary */}
      <div className="flex items-center space-x-4 p-4 bg-card rounded-lg">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User avatar'} />
          <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{user?.displayName || 'User'}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-md',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full flex items-center space-x-3"
        onClick={() => signOut()}
      >
        <LogOut className="h-5 w-5" />
        <span>Log out</span>
      </Button>
    </div>
  );
}