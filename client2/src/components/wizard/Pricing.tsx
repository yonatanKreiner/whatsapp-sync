"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { PRICING_PLAN } from "@/app/enums";

interface PricingPlan {
  id: PRICING_PLAN;
  name: string;
  price: string;
  description: string;
  features: string[];
}

const plans: PricingPlan[] = [
  {
    id: PRICING_PLAN.TRIAL,
    name: "Basic",
    price: "Free",
    description: "For occasional use",
    features: [
      "Sync up to 25 contacts",
      "Manual sync only",
      "Standard support",
      "Ad-supported experience",
    ],
  },
  {
    id: PRICING_PLAN.PRO,
    name: "Pro",
    price: "$4.99",
    description: "For personal use",
    features: ["Sync up to 250 contacts"],
  },
  {
    id: PRICING_PLAN.EXPERT,
    name: "Expert",
    price: "$9.99",
    description: "For power users",
    features: ["Sync up to 1000 contacts"],
  },
];

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(PRICING_PLAN.TRIAL);

  const [isLoading, setIsLoading] = useState(false);
  const [isPickedPlan, setIsPickedPlan] = useState(false);

  useEffect(() => {
    fetch("/api/auth/profile", { credentials: "include" }).then((res) => {
      res.json().then((data) => {
        if (data.PricingTier) {
          setIsPickedPlan(true);
          moveToNextStep();
        }
      });
    });
  }, []);

  const onClickTrial = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/pricing/trial", {
        credentials: "include",
      });

      if (res.status == 200) {
        setIsPickedPlan(true);
        moveToNextStep();
      }
    } catch (err) {
      Swal.fire(
        "Something went wrong",
        "Do you login to your google account?",
        "question"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onClickPayment = async (choosenPlan: PRICING_PLAN) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/pricing/stripe", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          choosen_plan: choosenPlan,
        }),
      });

      if (res.status == 200) {
        debugger;
        router.push((res.headers as any).location! as string);
        setIsPickedPlan(true);
        moveToNextStep();
      }
    } catch (err) {
      Swal.fire(
        "Something went wrong",
        "Do you login to your google account?",
        "question"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const moveToNextStep = () => {
    router.push("/wizard/google-contacts");
  };

  const router = useRouter();

  const handleContinue = () => {
    if (selectedPlan === PRICING_PLAN.TRIAL) {
      onClickTrial();
    } else {
      onClickPayment(selectedPlan as PRICING_PLAN);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Select the plan that best fits your needs. All plans include our core
          syncing features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative border rounded-lg p-5 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? "border-whatsapp bg-whatsapp/5 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div
              className={`absolute top-4 right-4 w-5 h-5 rounded-full ${
                selectedPlan === plan.id
                  ? "bg-whatsapp text-white"
                  : "border-2 border-gray-400"
              } flex items-center justify-center`}
            >
              {selectedPlan === plan.id && <Check size={12} />}
            </div>

            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl font-bold">{plan.price}</span>
              {plan.price !== "Free" && (
                <span className="ml-1 text-gray-500 text-xs">/month</span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <span className="mr-2 mt-0.5 text-whatsapp">
                    <Check size={14} />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/wizard/whatsapp-login")}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-whatsapp hover:bg-whatsapp-dark"
        >
          Continue
        </Button>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        All plans include a 14-day money-back guarantee. No credit card required
        for the Basic plan.
      </div>
    </div>
  );
};

export default Pricing;
