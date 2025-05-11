'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  LineChart,
  ResponsiveContainer,
} from 'recharts'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import SalesChart from "@/components/charts/sales-chart";
import InventoryChart from "@/components/charts/inventory-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [data, setData] = useState({
    sales: [],
    orders: [],
    visitors: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    const response = await fetch('/api/admin/analytics')
    const analyticsData = await response.json()
    setData(analyticsData)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <ResponsiveContainer height={350}>
          <BarChart data={data.sales}>
            {/* Chart configuration */}
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {/* Additional charts */}
    </div>
  )
}

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Sales" value="$12,345" change="+12.3%" />
        <MetricCard title="Orders" value="123" change="+5.2%" />
        <MetricCard title="Customers" value="456" change="+8.1%" />
        <MetricCard title="Avg. Order Value" value="$98" change="+3.2%" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart />
        <InventoryChart />
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
}

function MetricCard({ title, value, change }: MetricCardProps) {
  const isPositive = change.startsWith('+');
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}