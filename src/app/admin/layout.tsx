'use client';

import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { motion } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-navy-900 flex">
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <Sidebar />
        </motion.div>
        <div className="flex-1 flex flex-col">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Header />
          </motion.div>
          <main className="flex-1 overflow-y-auto p-6 text-white">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}