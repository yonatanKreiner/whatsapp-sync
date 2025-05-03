
import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-whatsapp-dark to-google-blue">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Sync Your Contacts?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get started in minutes and keep your Google contacts updated with WhatsApp profile images.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-whatsapp-dark font-medium">
              <Link href="/wizard/start">Start Syncing Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/faq">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
