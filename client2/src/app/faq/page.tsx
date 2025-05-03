
import React from 'react';
import Layout from '@/components/layout/Layout';
import FAQSection from '@/components/faq/FAQSection';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const FAQ = () => {
  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about WhatsSync and how it works.
            </p>
          </div>
        </div>
      </div>
      
      <FAQSection />
      
      <div className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our support team is here to help with any other questions you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-whatsapp hover:bg-whatsapp-dark">
                <Link href="/wizard/start">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="mailto:support@whatssync.com">Contact Support</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
