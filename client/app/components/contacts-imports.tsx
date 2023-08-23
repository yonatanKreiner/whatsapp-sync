import { useEffect, useState } from "react";
import { UserCard } from 'react-ui-cards';
import phoneparser from 'phoneparser';
import { parse, formatNumber } from 'libphonenumber-js';
import axios from "axios";

interface IProp {
    googleContacts?: any[];
    whatsappContacts?: any[];
}

export const ContactsImportsPhotos = ({ googleContacts, whatsappContacts }: IProp) => {
    const [contacts, setContacts] = useState<any[]>([])


    const innerJoin = (gContacts: any[], wContacts: any[]): any[] => {
        const contacts: any[] = [];
        gContacts.forEach((gContact, index) => {
            wContacts.forEach((wContact, i2) => {
                if (gContact.phoneNumber === wContact.phoneNumber) {
                    contacts.push({ gContact, wContact });
                }
            });
        });

        return contacts;
    }

    useEffect(() => {
        if (whatsappContacts && googleContacts) {
            const mappedWhatsappPhones = whatsappContacts?.map(x => {
                const phoneNumber = x.id.split('@')[0];
                const phone = phoneparser.parse(phoneNumber);
                const localizedPhone = phone?.localized?.stripped;
                const countryCode = phone?.country?.iso3166?.alpha2;

                return { ...x, countryCode, phoneNumber: phone.normalized, localizedPhone }
            });

            const mappedGooglePhones = googleContacts?.map(x => {
                const phone = x.phone;
                const number = parse(phone, { defaultCountry: "IL" });
                const parsedPhone = formatNumber(number, 'E.164');

                return { ...x, phoneNumber: parsedPhone };
            });

            const contacts = innerJoin(mappedGooglePhones, mappedWhatsappPhones);
            setContacts(contacts);
        }
    }, [])

    const updateContacts = async () => {
        const res = await axios.post('/api/people/update', {
            contacts: contacts.map(x => ({
                resourceName: x.gContact.resourceName,
                imageURL: x.wContact.imageURL,
                name: x.gContact.name,
                phone: x.gContact.phoneNumber
            }))
        }, { withCredentials: true });

        console.log(res);
    }

    const generateCards = () => {
        if (contacts) {
            const peopleCards = contacts.map(p => <UserCard
                key={p.gContact.phone}
                float
                href={null}
                header=''
                avatar={p.wContact.imageURL ?? ''}
                name={p.gContact.name}
                positionName={p.gContact.phoneNumber}
            />)

            return peopleCards;
        }

        return <></>
    }

    return (
        <div>
            {contacts ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {generateCards()}
                    <button onClick={updateContacts}>Start Update!</button>
                </div> : <div>'loading...'</div>}
        </div>
    );
}