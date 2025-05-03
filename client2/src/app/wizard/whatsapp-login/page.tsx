
import React from 'react';
import WizardLayout from '@/components/wizard/WizardLayout';
import WhatsAppLogin from '@/components/wizard/WhatsAppLogin';

const WhatsAppLoginPage = () => {
  return (
    <WizardLayout currentStep={1}>
      <WhatsAppLogin />
    </WizardLayout>
  );
};

export default WhatsAppLoginPage;
