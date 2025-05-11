'use client';

import { useState, useEffect } from 'react';
import { RecentOrders } from '@/components/RecentOrders';
import { useRouter } from 'next/navigation';
import { 
  Bar, 
  Line, 
  BarChart, 
  LineChart,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  Users,
  Package,
  DollarSign,
  ShoppingCart
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, description, trend, percentage, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex items-center pt-1">
          {trend === 'up' && <ArrowUpIcon className="h-4 w-4 text-green-500" />}
          {trend === 'down' && <ArrowDownIcon className="h-4 w-4 text-red-500" />}
          {trend === 'neutral' && <ArrowRightIcon className="h-4 w-4 text-yellow-500" />}
          <span className={`text-xs ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-yellow-500'
          }`}>
            {percentage}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [salesData, setSalesData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats');
        const data = await response.json();
        setSalesData(data.salesData);
        setOrderData(data.orderData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Revenue"
              value="$45,231.89"
              description="Monthly revenue"
              trend="up"
              percentage="+20.1%"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Orders"
              value="125"
              description="Total orders this month"
              trend="neutral"
              percentage="+0.5%"
              icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Customers"
              value="573"
              description="Active customers"
              trend="up"
              percentage="+12.5%"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Inventory"
              value="842"
              description="Products in stock"
              trend="down"
              percentage="-5.2%"
              icon={<Package className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest 10 orders
                </CardDescription>
              </CardHeader>              <CardContent>
                <RecentOrders orders={orderData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Additional tabs content */}
      </Tabs>
    </div>
  );
}
