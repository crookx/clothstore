import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { subscribeToInventoryUpdates } from '@/lib/websocket';
import { ErrorBoundary } from '@/components/error-boundary';
import { ExportData } from '@/components/export-data';

export default function InventoryChart() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventoryData();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToInventoryUpdates((newData) => {
      setInventoryData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory data');
      const data = await response.json();
      setInventoryData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inventory Levels</CardTitle>
          <ExportData 
            data={inventoryData} 
            filename="inventory-report"
          />
        </CardHeader>
        <CardContent>
          {loading && <LoadingSpinner />}
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          {!loading && !error && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#82ca9d" name="Current Stock" />
                <Bar dataKey="reorderPoint" fill="#ff8042" name="Reorder Point" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}