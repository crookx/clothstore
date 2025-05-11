'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface StatsWidgetProps {
  title: string;
  value: string | number;
  change?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function StatsWidget({
  title,
  value,
  change,
  loading,
  icon,
  action
}: StatsWidgetProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <p className={`text-xs ${
                change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className="mt-2 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`${action.label} for ${title}`}
              >
                {action.label}
              </button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}