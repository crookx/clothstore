
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Users } from 'lucide-react'; // Example icons

export default function AdminDashboardPage() {
    // In a real app, you'd fetch summary data here (total products, orders, revenue, etc.)
    const summaryData = {
        totalProducts: 150, // Example data
        totalOrders: 55,    // Example data
        totalRevenue: 125000, // Example data (in KES)
        totalUsers: 25,     // Example data
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryData.totalProducts}</div>
                        {/* <p className="text-xs text-muted-foreground">+2% from last month</p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        {/* Replace with appropriate icon if needed */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryData.totalOrders}</div>
                        {/* <p className="text-xs text-muted-foreground">+5 from yesterday</p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KES {summaryData.totalRevenue.toLocaleString()}</div>
                        {/* <p className="text-xs text-muted-foreground">+10% from last month</p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryData.totalUsers}</div>
                        {/* <p className="text-xs text-muted-foreground">+1 since last hour</p> */}
                    </CardContent>
                </Card>
            </div>

             <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder for recent orders, new users, etc. */}
                        <p className="text-muted-foreground">No recent activity to display yet.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
