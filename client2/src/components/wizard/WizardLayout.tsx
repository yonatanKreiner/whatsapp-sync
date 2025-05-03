
import Link from 'next/link';
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {[...Array(totalSteps)].map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={`flex-1 h-1 mx-2 ${
                  index <= currentStep ? 'bg-whatsapp' : 'bg-gray-200'
                }`}
              ></div>
            )}
            <div 
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index <= currentStep 
                  ? 'bg-whatsapp text-white' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-500">Start</span>
        <span className="text-sm text-gray-500">Complete</span>
      </div>
    </div>
  );
};

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
}

const WizardLayout = ({ children, currentStep }: WizardLayoutProps) => {
  const totalSteps = 4; // Google login, WhatsApp login, pricing, review & import
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-whatsapp-dark to-google-blue rounded-md w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-sm">WS</span>
            </div>
            <span className="font-bold text-xl">WhatsSync</span>
          </Link>
        </div>
        
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        <div className="bg-white rounded-xl shadow-md p-8">
          {children}
        </div>
        
        {/* Exit wizard link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Exit wizard and return to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
