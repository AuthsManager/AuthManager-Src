import React from 'react';
import { BackgroundGrid, GradientOrbs } from './background';
import Sidebar from '@/components/nav/Sidebar';
import Header from '@/components/nav/header';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dash');

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
        <Sidebar />
        <main className="flex-1 relative">
          <div className="container mx-auto px-4 py-8">
            <Header />
            <div className="mt-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}