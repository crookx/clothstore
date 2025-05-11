import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";

const revenueData = [
    { date: '2023-01', revenue: 24000 },
    { date: '2023-02', revenue: 28000 },
    { date: '2023-03', revenue: 32000 },
];

const categoryData = [
    { date: '2023-01', Clothing: 2400, Accessories: 1600, Footwear: 2000 },
    { date: '2023-02', Clothing: 3000, Accessories: 1800, Footwear: 2200 },
    { date: '2023-03', Clothing: 2800, Accessories: 2000, Footwear: 2400 },
];

const productData = [
    { product: 'T-Shirt', sales: 1200 },
    { product: 'Jeans', sales: 900 },
    { product: 'Sneakers', sales: 800 },
    { product: 'Hoodie', sales: 600 }
];

const customerSegments = [
    { name: 'New', value: 400 },
    { name: 'Returning', value: 300 },
    { name: 'VIP', value: 200 }
];
import {
    LineChart,
    BarChart,
    PieChart,
    AreaChart
} from "@/components/ui/charts";

export default function AnalyticsDashboard() {
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date()
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                    />
                    <Button>
                        Export Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <KPICard
                    title="Total Revenue"
                    value="$24,567"
                    trend="+12.5%"
                    description="vs. previous period"
                />
                <KPICard
                    title="Orders"
                    value="156"
                    trend="+8.2%"
                    description="vs. previous period"
                />
                <KPICard
                    title="Customers"
                    value="2,345"
                    trend="+15.8%"
                    description="vs. previous period"
                />
                <KPICard
                    title="Avg. Order Value"
                    value="$157.52"
                    trend="+4.3%"
                    description="vs. previous period"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AreaChart
                            data={revenueData}
                            xAxis="date"
                            yAxis="revenue"
                            height={300}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={productData}
                            xAxis="product"
                            yAxis="sales"
                            height={300}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Segments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PieChart
                            data={customerSegments}
                            height={300}
                        />
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={categoryData}
                            xAxis="date"
                            yAxis="sales"
                            series={["Clothing", "Accessories", "Footwear"]}
                            height={300}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

interface KPICardProps {
    title: string;
    value: string;
    trend: string;
    description: string;
}

function KPICard({ title, value, trend, description }: KPICardProps) {
    const isPositive = trend.startsWith('+');
    
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    <div className="flex items-center gap-2">
                        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                            {trend}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {description}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}