'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MenuIcon, XIcon, ShoppingCartIcon, UserIcon, Heart, HomeIcon, ShoppingBag } from 'lucide-react';
import QaranLogo from '../../assets/Qaran.png';
import { useAuth } from '@/context/auth-context';
import { useWishlist } from '@/context/wishlist-context';
import { useCart } from '@/context/cart-context';
import { LogoutButton } from './LogoutButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { cart } = useCart();

  const mainNavLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/products', label: 'All Products', icon: ShoppingBag },
    { href: '/wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { href: '/cart', label: 'Cart', icon: ShoppingCartIcon, count: cart.length },
  ];

  const userNavLinks = user ? [
    { href: '/profile', label: 'Profile', icon: UserIcon },
    { href: '/orders', label: 'Orders', icon: ShoppingBag },
  ] : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5">
          <Image src={QaranLogo} alt="ClothStore Logo" width={40} height={40} className="h-8 w-auto" />
          <span className="text-2xl font-bold">QaranBabyShop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Show only Home and All Products in desktop nav */}
          {mainNavLinks.slice(0, 2).map(({ href, label, icon: Icon }) => (
            <Link 
              key={label} 
              href={href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCartIcon className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {userNavLinks.map(({ href, label }) => (
                  <DropdownMenuItem key={label} asChild>
                    <Link href={href}>{label}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <UserIcon className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <nav className="space-y-1 px-4 py-2">
            {/* All navigation links in mobile menu */}
            {mainNavLinks.map(({ href, label, icon: Icon, count }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-muted-foreground hover:text-primary"
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {label}
                </span>
                {(count ?? 0) > 0 && (
                  <span className="h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            ))}
            
            {user && (
              <>
                <div className="h-px bg-border my-2" />
                {userNavLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-muted-foreground hover:text-primary"
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                <LogoutButton className="w-full flex items-center gap-2 py-2 text-muted-foreground hover:text-primary" />
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}