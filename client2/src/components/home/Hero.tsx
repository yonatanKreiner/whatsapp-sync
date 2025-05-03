"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="flex-1 max-w-2xl mb-12 lg:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Sync WhatsApp Profile Photos to 
              <span className="bg-gradient-to-r from-whatsapp to-google-blue bg-clip-text text-transparent"> Google Contacts</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 mb-8"
            >
              Keep your contact list vibrant and updated with profile pictures from WhatsApp. Connect once, sync anytime.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="bg-whatsapp hover:bg-whatsapp-dark text-white font-medium px-8">
                <Link href="/wizard/start">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/faq">Learn More</Link>
              </Button>
            </motion.div>
          </div>
          
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <div className="relative mx-auto w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                  <div className="bg-whatsapp p-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                      <div className="w-6 h-6 rounded-full bg-whatsapp-dark flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                    </div>
                    <span className="text-white font-medium">WhatsApp</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-200"></div>
                      </div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-xs text-gray-500">Last seen today</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-200"></div>
                          </div>
                          <div className="flex-1 h-4 bg-gray-200 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex items-center">
                      <div className="w-12 h-12 rounded-full bg-whatsapp-light flex items-center justify-center">
                        <div className="w-6 h-6 text-whatsapp">
                          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-sm">Syncing in progress...</p>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-whatsapp w-2/3 animate-pulse-slow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Google contact overlay */}
                <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-white rounded-lg shadow-xl border border-gray-200 p-2">
                  <div className="bg-google-blue h-6 rounded-t-sm flex items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
                    <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <div className="w-8 h-8 mx-auto rounded-full bg-gray-200 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-whatsapp-light to-whatsapp"></div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full w-full mt-2"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
                    <div className="flex justify-between mt-2">
                      <div className="w-3 h-3 rounded-full bg-google-green"></div>
                      <div className="w-3 h-3 rounded-full bg-google-red"></div>
                      <div className="w-3 h-3 rounded-full bg-google-yellow"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Background decorations */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-whatsapp-light/30 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-google-blue/20 rounded-full filter blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
