import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Props = {
    moveToNextStep: () => void;
};

export const GoogleContactsStep = ({ moveToNextStep }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<any[]>([]);

    useEffect(() => {
        const fetchGoogleContacts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/people/read', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setContacts(data);
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
        moveToNextStep();
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