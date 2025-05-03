
import React from 'react';
import WizardLayout from '@/components/wizard/WizardLayout';
import Pricing from '@/components/wizard/Pricing';

const PricingPage = () => {
  return (
    <WizardLayout currentStep={2}>
      <Pricing />
    </WizardLayout>
  );
};

export default PricingPage;
