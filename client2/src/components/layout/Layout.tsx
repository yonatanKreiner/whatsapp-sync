
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { TooltipProvider } from '../ui/tooltip';
import { Toaster as Sonner } from '../ui/sonner';
import { Toaster } from '../ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <TooltipProvider>
  {/* <Toaster /> */}
    <Sonner />
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
    </TooltipProvider>
  );
};

export default Layout;
