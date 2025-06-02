import React, { useState } from 'react';
import { BackgroundGrid, GradientOrbs } from './background';
import Sidebar from '@/components/nav/Sidebar';
import Header from '@/components/nav/Header';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dash') || location.pathname.startsWith('/admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (!isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BackgroundGrid />
        <GradientOrbs />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 relative">
          <div className="container mx-auto px-4 py-8">
            <Header toggleSidebar={toggleSidebar} />
            <div className="mt-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}