
import React from 'react';
import WizardLayout from '@/components/wizard/WizardLayout';
import Review from '@/components/wizard/Review';

const ReviewPage = () => {
  return (
    <WizardLayout currentStep={3}>
      <Review />
    </WizardLayout>
  );
};

export default ReviewPage;
