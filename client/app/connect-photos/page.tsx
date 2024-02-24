"use client"
import { useEffect, useState } from 'react';

import { SignIn } from '../components/google-signin';
import { WhatappConnector } from '../components/whatsapp-connector';
import { ContactsImportsPhotos } from '../components/contacts-imports';
import { GoogleConnector } from '../components/google-connector';
import { PricingTiers } from '../components/pricing-tiers';

import { Timeline } from '@mantine/core';
import { FaGoogle, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { RiContactsBook2Fill } from "react-icons/ri";
import { IoMdLogIn } from "react-icons/io";

import './page.css'
import { useLargeScreen } from '../hooks/useLargeScreen';
import { MoveToDesktop } from '../components/moveToDesktop';

export default function Page() {
    const [whatsappContactsData, setWhatsappContactsData] = useState<any[] | undefined>(undefined);
    const [googleContactsData, setGoogleContactsData] = useState<any[] | undefined>(undefined);
    const [activeStep, setActiveStep] = useState<number>(0);
    const isDesktop = useLargeScreen();

    const moveToNextStep = () => {
        setActiveStep((prev) => prev + 1)
    }
    useEffect(() => {
        console.log(activeStep)
    }, [activeStep])

    const onLoadWhatsappContacts = (contacts: any[]) => {
        setActiveStep(4)
        setWhatsappContactsData(contacts);
    }

    const onLoadGoogleContacts = (contacts: any[]) => {
        setActiveStep(3)
        setGoogleContactsData(contacts);
    }

    if (!isDesktop) {
        return <MoveToDesktop />
    }

    return (
        <div className='container-timeline'>
            <Timeline active={activeStep} lineWidth={5} bulletSize={32} color="teal">
                <Timeline.Item bullet={<IoMdLogIn size={15} />} title="SignIn">
                    {activeStep === 0 ? <SignIn moveToNextStep={moveToNextStep} /> : <></>}
                </Timeline.Item>
                <Timeline.Item bullet={<FaTelegramPlane size={15} />} title="Plan Choosing">
                    {activeStep === 1 ? <PricingTiers moveToNextStep={moveToNextStep} /> : <></>}
                </Timeline.Item>
                <Timeline.Item bullet={<FaGoogle size={15} />} title="Google Contacts">
                    {activeStep === 2 ? <GoogleConnector setGoogleContactsData={onLoadGoogleContacts} /> : <></>}
                </Timeline.Item>
                <Timeline.Item bullet={<FaWhatsapp size={15} />} lineVariant="dashed" title="Whatsapp SignIn">
                    {activeStep === 3 ? <WhatappConnector setWhatsappContactsData={onLoadWhatsappContacts} /> : <></>}
                </Timeline.Item>
                <Timeline.Item bullet={<RiContactsBook2Fill size={15} />} title="Update Contacts">
                    {activeStep === 4 ? <ContactsImportsPhotos googleContacts={googleContactsData} whatsappContacts={whatsappContactsData} /> : <></>}
                </Timeline.Item>
            </Timeline>
        </div>
    )
}