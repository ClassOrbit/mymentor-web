import React from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr]">
      <Sidebar />
      
      <div className="flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6 bg-gray-950 text-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;