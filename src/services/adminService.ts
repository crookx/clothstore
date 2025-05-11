import { collection, getDocs, doc, updateDoc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import type { User } from '@/types/user';

interface OrderStats {
  id: string;
  total: number;
  createdAt: string;
  status: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: OrderStats[]; 
  topProducts: Product[];
}

export async function getAnalytics(): Promise<DashboardStats> {
  try {
    const response = await fetch('/api/admin/analytics', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

export async function getUsers() {
  const response = await fetch('/api/admin/users', {
    credentials: 'include',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function updateUserRole(userId: string, newRole: string) {
  const response = await fetch(`/api/admin/users/${userId}/role`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: newRole })
  });

  if (!response.ok) {
    throw new Error('Failed to update user role');
  }

  return response.json();
}

export async function updateUserDetails(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
}

export async function updateUserStatus(userId: string, status: string) {
  const response = await fetch(`/api/admin/users/${userId}/status`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error('Failed to update user status');
  }

  return response.json();
}

export async function getUserDetails(userId: string) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const ordersRef = collection(db, 'orders');
  const ordersQuery = query(
    ordersRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const ordersSnapshot = await getDocs(ordersQuery);
  const orders = ordersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as OrderStats[];

  return {
    id: userDoc.id,
    ...userDoc.data(),
    orders
  } as User;
}

export async function initiatePasswordReset(userId: string) {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to initiate password reset');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error initiating password reset:', error);
    throw error;
  }
}