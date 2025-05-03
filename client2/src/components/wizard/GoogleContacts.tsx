"use client";

import { SessionStorageKeys, sessionStorageUtil } from "@/lib/sessionStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const GoogleContactsStep = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchGoogleContacts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/people/read', { credentials: 'include', method: 'POST' })
                if (response.ok) {
                    const data = await response.json();
                    sessionStorageUtil.setItem(SessionStorageKeys.GOOGLE_CONTACTS, data);
                    router.push('/wizard/whatsapp-login');
                } else {
                    Swal.fire('Error', 'Failed to fetch Google Contacts', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'An unexpected error occurred', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoogleContacts();
    }, []);

    const handleNext = () => {
        router.push('/wizard/whatsapp-login');
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading Google Contacts...</p>
            ) : (
                <div>
                    <h2>Google Contacts</h2>
                    <ul>
                        {contacts.map((contact, index) => (
                            <li key={index}>{contact.names?.[0]?.displayName || 'Unnamed Contact'}</li>
                        ))}
                    </ul>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
        </div>
    );
};