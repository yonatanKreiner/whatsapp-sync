"use client"
import { useEffect } from 'react';

export default function Page() {
    const getPeople = async () => {
        const res = await fetch('/api/people')
    }


    const auth = async () => {
        const res = await fetch('/api/auth/register');
        console.log(res)

        if(res.status == 401){
            window.document.location = res.headers.get("location")!;
        }else{
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
123123
        </div>
    )
}
