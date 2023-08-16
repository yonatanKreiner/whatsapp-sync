"use client"
import { useEffect, useState } from 'react';
import MultiStep from 'react-multistep';

import { SignIn } from '../components/google-signin';
import { WhatappConnector } from '../components/whatsapp-connector';
import { ContactsImportsPhotos } from '../components/contacts-imports';

export default function Page() {
    const [people, setPeople] = useState([]);

    const getPeople = async () => {
        const res = await fetch('/api/people');
        const data = await res.json();
        
        setPeople(data.map((p: any) => ({
            resourceNane: p.resourceName,
            name: p.names[0].displayName,
            phone: p.phoneNumbers[0].value
        })));
    }

    const auth = async () => {
        const res = await fetch('/api/auth/register');
        console.log(res)

        if (res.status == 401) {
            window.document.location = res.headers.get("location")!;
        } else {
            console.log('logged in');
            await getPeople();
        }

        return res;
    }

    useEffect(() => {
        // auth();
    }, [])

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
