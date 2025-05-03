
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does WhatsSync access my WhatsApp contacts?",
    answer: "WhatsSync uses the WhatsApp Web interface through a secure connection to access your contacts. We do not store any of your messages or personal data. The connection is only used to retrieve profile pictures of your contacts."
  },
  {
    question: "Is it safe to use WhatsSync with my Google account?",
    answer: "Yes, WhatsSync uses official Google OAuth for authentication. We only request the specific permissions needed to update contact photos, and we never store your Google credentials. You can revoke access at any time from your Google account settings."
  },
  {
    question: "How often can I sync my contacts?",
    answer: "With our free plan, you can manually sync up to 25 contacts whenever you want. Premium plans offer automatic syncing on weekly or custom schedules, depending on your subscription level."
  },
  {
    question: "Will WhatsSync change any contact information other than photos?",
    answer: "No. WhatsSync only modifies the profile pictures of your contacts. No names, phone numbers, email addresses, or other information is changed or accessed."
  },
  {
    question: "What happens if a contact doesn't have a WhatsApp profile picture?",
    answer: "If a contact doesn't have a WhatsApp profile picture, their Google contact photo will remain unchanged. We only update photos when there's a WhatsApp image available."
  },
  {
    question: "Can I choose which contacts to sync?",
    answer: "Yes, before finalizing the sync process, you'll have the opportunity to review and select which contacts you want to update. You have full control over the process."
  },
  {
    question: "Do I need to keep the WhatsSync webpage open during syncing?",
    answer: "No, once you've authorized the connection, the sync process runs on our secure servers. You can close your browser, and you'll receive an email notification when the sync is complete."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Absolutely. You can cancel your Premium or Business subscription at any time from your account settings. There are no cancellation fees or hidden charges."
  },
  {
    question: "Is WhatsSync available on mobile devices?",
    answer: "Yes, WhatsSync works on any device with a modern web browser, including mobile phones and tablets. Simply visit our website and follow the same process."
  },
  {
    question: "What happens if I have duplicate contacts?",
    answer: "Our smart matching algorithm identifies duplicates based on phone numbers and ensures that the correct profile picture is assigned to each contact. You can review all changes before they're applied."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20" id="faq">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about WhatsSync.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Have more questions? <a href="#" className="text-whatsapp font-medium hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
