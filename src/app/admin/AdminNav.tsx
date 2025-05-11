'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, Users, BarChart2, Settings, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

const adminNavItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard', exact: true },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/inventory', icon: Package, label: 'Inventory' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

const NavLink = ({ href, children, exact = false }: { href: string; children: ReactNode; exact?: boolean }) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  
  return (
    <Link href={href} className={cn(
      "flex items-center space-x-3 p-2.5 hover:bg-slate-700 rounded-md transition-colors text-sm",
      isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-slate-300 hover:text-white'
    )}>
      {children}
    </Link>
  );
};

export default function AdminNav() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-slate-800 p-4">
      <div className="space-y-4">
        {adminNavItems.map(({ href, icon: Icon, label, exact }) => (
          <NavLink key={href} href={href} exact={exact}>
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}