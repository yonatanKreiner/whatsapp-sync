"use client"
import { useEffect, useState } from 'react';
import MultiStep from 'react-multistep';

import { SignIn } from '../components/google-signin';
import { WhatappConnector } from '../components/whatsapp-connector';
import { ContactsImportsPhotos } from '../components/contacts-imports';
import { GoogleConnector } from '../components/google-connector';
import { PricingTiers } from '../components/pricing-tiers';

export default function Page() {
    const [whatsappContactsData, setWhatsappContactsData] = useState<any[] | undefined>(undefined);
    const [googleContactsData, setGoogleContactsData] = useState<any[] | undefined>(undefined);
    const [activeStep, setActiveStep] = useState<number>(0);

    const onLoadWhatsappContacts = (contacts: any[]) => {
        setActiveStep(4)
        setWhatsappContactsData(contacts);
     }

     const onLoadGoogleContacts = (contacts: any[]) => {
        setActiveStep(3)
        setGoogleContactsData(contacts);
     }

    return (
        <div>
            <MultiStep activeStep={activeStep}>
                <div title='Sign In'>
                    <SignIn></SignIn>
                </div>
                <div title='Plan choosing'><PricingTiers></PricingTiers></div>
                <div title='Connect to google contacts'>
                    <GoogleConnector setGoogleContactsData={onLoadGoogleContacts}></GoogleConnector>
                </div>
                <div title='Connect to Whatsapp'>
                    <WhatappConnector setWhatsappContactsData={onLoadWhatsappContacts}></WhatappConnector>
                </div>
                <div title='Update contacts'>
                    <ContactsImportsPhotos googleContacts={googleContactsData} whatsappContacts={whatsappContactsData}></ContactsImportsPhotos>
                </div>
            </MultiStep>
        </div>
    )
}
