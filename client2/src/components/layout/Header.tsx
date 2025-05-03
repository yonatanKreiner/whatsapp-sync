
import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-whatsapp-dark to-google-blue rounded-md w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold text-sm">WS</span>
          </div>
          <span className="font-bold text-xl">WhatsSync</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-whatsapp">Home</Link>
          <Link href="/faq" className="text-sm font-medium transition-colors hover:text-whatsapp">FAQ</Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button asChild variant="ghost">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="bg-whatsapp hover:bg-whatsapp-dark">
            <Link href="/wizard/start">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
