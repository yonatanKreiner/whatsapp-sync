"use client"
import { useEffect, useState } from 'react';
import MultiStep from 'react-multistep';

import { SignIn } from '../components/google-signin';
import { WhatappConnector } from '../components/whatsapp-connector';
import { ContactsImportsPhotos } from '../components/contacts-imports';

export default function Page() {

    return (
        <div>
            <MultiStep>
                <div title='Sign In'>
                    <SignIn></SignIn>
                </div>
                <div title='Plan choosing'>Choose the right plan for you</div>
                <div title='Connect to Whatsapp'>
                    <WhatappConnector></WhatappConnector>
                </div>
                <div title='Import photos'>
                    <ContactsImportsPhotos></ContactsImportsPhotos>
                </div>
            </MultiStep>
        </div>
    )
}
