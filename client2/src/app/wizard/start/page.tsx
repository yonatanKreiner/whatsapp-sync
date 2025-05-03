import React from "react";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const WizardStart = () => {
  return (
    <WizardLayout currentStep={-1}>
      <div className="text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-whatsapp to-google-blue">
          <div className="bg-white rounded-full p-1.5">
            <div className="bg-gradient-to-r from-whatsapp-dark to-google-blue rounded-md w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-sm">WS</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Welcome to WhatsSync Setup
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {`We'll guide you through connecting your WhatsApp and Google accounts to sync profile photos. The process takes less than 5 minutes.`}
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="font-semibold mb-4">In this wizard, you will:</h3>
          <ul className="text-left space-y-3">
            <li className="flex items-start">
              <span className="mr-3 mt-0.5 text-whatsapp flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <path d="M22 4 12 14.01l-3-3"></path>
                </svg>
              </span>
              <span>Connect to your Google Contacts (using secure OAuth)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-0.5 text-whatsapp flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <path d="M22 4 12 14.01l-3-3"></path>
                </svg>
              </span>
              <span>Connect to WhatsApp (using secure QR code)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-0.5 text-whatsapp flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <path d="M22 4 12 14.01l-3-3"></path>
                </svg>
              </span>
              <span>Choose the plan that fits your needs</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-0.5 text-whatsapp flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <path d="M22 4 12 14.01l-3-3"></path>
                </svg>
              </span>
              <span>Review and import profile photos to Google Contacts</span>
            </li>
          </ul>
        </div>

        <div className="text-sm text-gray-500 mb-8">
          <p>
            We value your privacy. WhatsSync does not store your contacts or
            profile pictures.
          </p>
          <p className="mt-2">
            All data is synced securely between your accounts.
          </p>
        </div>

        <Link href="/wizard/google-login">
          <Button
            size="lg"
            className="bg-whatsapp hover:bg-whatsapp-dark"
          >
            Begin Setup
          </Button>
        </Link>
      </div>
    </WizardLayout>
  );
};

export default WizardStart;
