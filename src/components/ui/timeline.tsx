import { cn } from "@/lib/utils";
import { ReactNode } from 'react';

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

interface TimelineItemProps {
  title: ReactNode;  // Changed from string to ReactNode
  description?: string;
  date?: Date;
  icon?: React.ReactNode;
}

export function TimelineRoot({ children, className }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}

export function TimelineItem({ date, icon, title, description }: TimelineItemProps) {
  return (
    <div className="flex gap-4">
      {icon && (
        <div className="mt-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
            {icon}
          </div>
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {typeof title === 'string' ? (
            <h4 className="font-medium">{title}</h4>
          ) : (
            title
          )}
          {date && (
            <span className="text-sm text-muted-foreground">
              {date.toLocaleString()}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export function Timeline({ children }: { children: ReactNode }) {
    return <div className="space-y-4">{children}</div>;
}