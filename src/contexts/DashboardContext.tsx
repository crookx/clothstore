'use client';

import { createContext, useContext, useState } from 'react';

type DashboardPreferences = {
  visibleWidgets: string[];
  dateRange: string;
  defaultView: string;
}

type DashboardContextType = {
  preferences: DashboardPreferences;
  updatePreferences: (prefs: Partial<DashboardPreferences>) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<DashboardPreferences>({
    visibleWidgets: ['sales', 'orders', 'inventory', 'customers'],
    dateRange: '7d',
    defaultView: 'grid'
  });

  const updatePreferences = (prefs: Partial<DashboardPreferences>) => {
    setPreferences(curr => ({ ...curr, ...prefs }));
  };

  return (
    <DashboardContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};