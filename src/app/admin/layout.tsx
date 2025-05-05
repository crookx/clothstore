
import type { Metadata } from 'next';
import Link from 'next/link';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar'; // Assuming sidebar component exists
import { Home, Package, Settings, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: 'AstraBaby Admin',
    description: 'Admin Dashboard for AstraBaby Shop',
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="p-4">
                    <Link href="/admin/dashboard" className="font-semibold text-lg text-primary">
                        AstraBaby Admin
                    </Link>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/dashboard">
                                    <Home />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/products">
                                    <Package />
                                    <span>Products</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                         {/* Add other admin links here (Orders, Users, Settings) */}
                        {/*
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/orders">
                                    <ShoppingCart /> // Assuming ShoppingCart icon exists
                                    <span>Orders</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/users">
                                    <Users />
                                    <span>Users</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/settings">
                                    <Settings />
                                    <span>Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem> */}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <main className="flex-1 p-6 bg-muted/40">
                 <div className="flex justify-between items-center mb-4">
                    {/* Placeholder for page title or actions */}
                    <SidebarTrigger className="md:hidden" /> {/* Show trigger on mobile */}
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}
