export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Product[];
}

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
}