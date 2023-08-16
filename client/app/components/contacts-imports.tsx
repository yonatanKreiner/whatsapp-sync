import { useEffect, useState } from "react";

export const ContactsImportsPhotos = () => {

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

    useEffect(() => {
        getPeople();
    })

    return (
        <div>
            {people ? <div>{JSON.stringify(people)}</div> : <div>'loading...'</div>}
        </div>
    );
}