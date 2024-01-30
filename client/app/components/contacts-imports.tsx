import { useEffect, useState } from "react";
import phoneparser from 'phoneparser';
import { parse, formatNumber } from 'libphonenumber-js';
import axios from "axios";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import LoadingAnimation from '../../public/assets/animation_loading.json';
import { ResultStatus, UpdateContactsProfilesPhotos } from "../services/google-people";

interface IProp {
    googleContacts?: any[];
    whatsappContacts?: any[];
}

export const ContactsImportsPhotos = ({ googleContacts, whatsappContacts }: IProp) => {
    const [contacts, setContacts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        try {
            const res = await UpdateContactsProfilesPhotos(contacts.map(x => ({
                resourceName: x.gContact.resourceName,
                imageURL: x.wContact.imageURL,
                name: x.gContact.name,
                phone: x.gContact.phoneNumber
            })));

            console.log(res);
            if (res === ResultStatus.SUCCEED) {
                Swal.fire(
                    'Succeed import photos',
                    'Your contacts photos has been updated succesfully',
                    'success'
                ).then(() => {
                    window.location.href = "/";
                })
            }else {
                Swal.fire(
                    'Something went wrong',
                    'Please check every step in the proccess',
                    'question'
                );    
            }
        } catch (err) {
            Swal.fire(
                'Something went wrong',
                'Please check every step in the proccess',
                'question'
            );
        } finally {
            setIsLoading(false);
        }
    }

    const generateCards = () => {
        if (contacts) {
            const peopleCards = contacts.map(p => (
                <div style={{ border: '3px silver solid', borderRadius: '10px', padding: '10px' }}>
                    <h4 style={{ textAlign: 'center', margin: '10px 5px' }}>{p.gContact.name}</h4>
                    <span>
                        <img style={{ borderRadius: '50%' }} src={p.gContact.imageUrl ?? ''}></img>
                        <h5 style={{ fontWeight: "bold", textAlign: "center" }}>&dArr;</h5>
                        <img style={{ borderRadius: '50%' }} src={p.wContact.imageURL ?? ''}></img>
                    </span>
                </div>
            ));

            return peopleCards;
        }

        return <></>
    }

    return (
        <div>
            {contacts ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {generateCards()}
                    {!isLoading ? <button onClick={updateContacts}>Start Update!</button> :
                        <Lottie style={{ width: "15%", height: "15%" }} animationData={LoadingAnimation} />}
                </div> : <></>}
        </div>
    );
}