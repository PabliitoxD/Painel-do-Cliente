"use client";

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import './Layout.css';
import '../../app/dashboard/components.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <Topbar />
      <div className="dashboard-main">
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
