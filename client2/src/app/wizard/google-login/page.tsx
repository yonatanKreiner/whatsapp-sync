import React from 'react';
import WizardLayout from '@/components/wizard/WizardLayout';
import GoogleLogin from '@/components/wizard/GoogleLogin';

const GoogleLoginPage = () => {
  return (
    <WizardLayout currentStep={0}>
      <GoogleLogin />
    </WizardLayout>
  );
};

export default GoogleLoginPage;
