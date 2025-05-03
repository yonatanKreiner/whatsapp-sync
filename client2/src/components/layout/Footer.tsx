
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-whatsapp-dark to-google-blue rounded-md w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-sm">WS</span>
              </div>
              <span className="font-bold text-xl">WhatsSync</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Seamlessly sync your WhatsApp profile images with your Google contacts.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-whatsapp">Home</Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-whatsapp">FAQ</Link>
              </li>
              <li>
                <Link href="/wizard/start" className="text-sm text-gray-600 hover:text-whatsapp">Get Started</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-whatsapp">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-whatsapp">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            &copy; {year} WhatsSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
