"use client"
import { useEffect, useState } from 'react';

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
        auth();
    }, [])

    return (
        <div>
            {people ? <div>{JSON.stringify(people)}</div> : <div>'loading...'</div>}
        </div>
    )
}
