import { useEffect, useState } from "react";
import { UserCard } from 'react-ui-cards';

interface IPeople {
    resourceNane: string;
    name: string;
    phone: string;
    imageUrl: string | null
}

interface IProp {
    googleContacts?: any[];
    whatsappContacts?: any[];
}

export const ContactsImportsPhotos = ({googleContacts, whatsappContacts}:IProp) => {

    const generateCards = () => {
        if (googleContacts){
            const peopleCards = googleContacts.map(p => <UserCard
                key={p.phone}
                float
                href={null}
                header=''
                avatar={p.imageUrl ?? ''}
                name={p.name}
                positionName={p.phone}
            />)

            return peopleCards;
        }
        
        return <></>
    }

    return (
        <div>
            {googleContacts ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {generateCards()}
                </div> : <div>'loading...'</div>}
        </div>
    );
}