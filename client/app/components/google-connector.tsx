import { useEffect, useState } from "react";

interface IPeople {
    resourceNane: string;
    name: string;
    phone: string;
    imageUrl: string | null
}

interface IProp {
    setGoogleContactsData: (googleContacts: any[])=>void
}

export const GoogleConnector = ({setGoogleContactsData}:IProp) => {

    const [isLoadContansSucceed, setIsLoadContansSucceed] = useState<boolean>(false);

    const getPeople = async () => {
        const res = await fetch('/api/people/read');
        const data = await res.json();

        const peopleData = (data.map((p: any) => ({
            resourceName: p.resourceName,
            name: p.names[0].displayName,
            phone: p.phoneNumbers[0].value,
            imageUrl: p.photos[0].url
        })));

        setIsLoadContansSucceed(true);
        setGoogleContactsData(peopleData);
    }

    useEffect(() => {
        getPeople();
    }, [])

    return (
        <div>
            {isLoadContansSucceed ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    Succeed load contacts from google!
                </div> : <div>'loading...'</div>}
        </div>
    );
}