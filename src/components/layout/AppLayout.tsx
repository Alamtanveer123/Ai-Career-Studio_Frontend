import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '../common/ToastContainer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-[#FAFAFA] dark:bg-[#0B0F17] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200">
      {/* AI Career Top Navigation */}
      <Navbar />

      {/* Spacious Main Workspace Container */}
      <main className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-20">
        <Outlet />
      </main>

      {/* Production Footer */}
      <Footer />

      {/* Toast Alert Notifications */}
      <ToastContainer />
    </div>
  );
};
