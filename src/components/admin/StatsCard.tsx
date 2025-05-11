'use client';

import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, description, trend, percentage, icon }: StatsCardProps) {
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