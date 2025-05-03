
import React from 'react';

const steps = [
  {
    number: 1,
    title: "Connect WhatsApp",
    description: "Scan a QR code to connect WhatsApp Web securely to WhatsSync.",
  },
  {
    number: 2,
    title: "Connect Google",
    description: "Authorize access to your Google Contacts via secure OAuth.",
  },
  {
    number: 3,
    title: "Select Plan",
    description: "Choose from our flexible plans based on your needs.",
  },
  {
    number: 4,
    title: "Review & Import",
    description: "Preview changes and import profile pictures with one click.",
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20" id="how-it-works">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How WhatsSync Works</h2>
          <p className="text-lg text-gray-600">
            Syncing your WhatsApp profile images to Google Contacts is just a few simple steps away.
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>
          
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`flex flex-col lg:flex-row items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                  <div className="lg:w-1/2 flex justify-center mb-6 lg:mb-0">
                    <div className="w-20 h-20 rounded-full bg-whatsapp bg-opacity-10 flex items-center justify-center z-10">
                      <div className="w-14 h-14 rounded-full bg-whatsapp flex items-center justify-center text-white font-bold text-xl">
                        {step.number}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'} text-center lg:text-left ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                    <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
