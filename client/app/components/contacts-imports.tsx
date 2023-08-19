import { useEffect, useState } from "react";
import { UserCard } from 'react-ui-cards';

interface IPeople {
    resourceNane: string;
    name: string;
    phone: string;
    imageUrl: string | null
}

export const ContactsImportsPhotos = () => {

    const [people, setPeople] = useState<IPeople[]>([]);

    const getPeople = async () => {
        const res = await fetch('/api/people');
        const data = await res.json();

        setPeople(data.map((p: any) => ({
            resourceNane: p.resourceName,
            name: p.names[0].displayName,
            phone: p.phoneNumbers[0].value,
            imageUrl: null
        })));
    }

    useEffect(() => {
        getPeople();
    })

    const generateCards = () => {
        const peopleCards = people.map(p => <UserCard
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

    return (
        <div>
            {people ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {generateCards()}
                </div> : <div>'loading...'</div>}
        </div>
    );
}