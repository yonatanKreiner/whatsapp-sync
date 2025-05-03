
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from 'next/link';

interface PlanFeature {
  text: string;
  available: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for trying out WhatsSync",
    features: [
      { text: "Sync up to 25 contacts", available: true },
      { text: "Manual sync only", available: true },
      { text: "Standard support", available: true },
      { text: "Ad-supported experience", available: true },
      { text: "Auto-sync", available: false },
      { text: "Priority support", available: false },
    ],
    buttonText: "Get Started",
  },
  {
    name: "Premium",
    price: "$4.99/mo",
    description: "Ideal for personal use",
    features: [
      { text: "Sync up to 500 contacts", available: true },
      { text: "Auto-sync (weekly)", available: true },
      { text: "Priority support", available: true },
      { text: "Ad-free experience", available: true },
      { text: "Backup & restore", available: true },
      { text: "Custom sync schedules", available: false },
    ],
    buttonText: "Go Premium",
    popular: true,
  },
  {
    name: "Business",
    price: "$9.99/mo",
    description: "For power users and businesses",
    features: [
      { text: "Unlimited contacts", available: true },
      { text: "Auto-sync (custom schedule)", available: true },
      { text: "Priority support", available: true },
      { text: "Ad-free experience", available: true },
      { text: "Backup & restore", available: true },
      { text: "API access", available: true },
    ],
    buttonText: "Choose Business",
  },
];

const PricingPlans = () => {
  return (
    <section className="py-20" id="pricing">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600">
            Choose the plan that works best for your needs. No hidden fees.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-xl border ${plan.popular ? 'border-whatsapp shadow-lg' : 'border-gray-200 shadow-sm'} overflow-hidden transition-all hover:shadow-md`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-whatsapp text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Free" && <span className="ml-1 text-gray-500">/month</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={`mr-2 mt-1 ${feature.available ? 'text-whatsapp' : 'text-gray-300'}`}>
                        <Check size={16} />
                      </span>
                      <span className={feature.available ? 'text-gray-600' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild
                  className={`w-full ${plan.popular ? 'bg-whatsapp hover:bg-whatsapp-dark' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href="/wizard/pricing">{plan.buttonText}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-gray-500 text-sm">
            All plans include a 14-day money-back guarantee. No contracts, cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
