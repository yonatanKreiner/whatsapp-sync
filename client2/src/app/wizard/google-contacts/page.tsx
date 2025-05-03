
import React from 'react';
import WizardLayout from '@/components/wizard/WizardLayout';
import GoogleLogin from '@/components/wizard/GoogleLogin';
import { GoogleContactsStep } from '@/components/wizard/GoogleContacts';

const GoogleContantsPage = () => {
  return (
    <WizardLayout currentStep={0}>
      <GoogleContactsStep />
    </WizardLayout>
  );
};

export default GoogleContantsPage;
