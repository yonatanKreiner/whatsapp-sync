"use client"
import { useEffect } from 'react';


export default function Page() {
    const auth = async () => {
        const res = await fetch('/api/auth/register');
        console.log(res)

        if(res.status == 401){
            window.document.location = res.headers.get("location")!;
        }else{
            console.log('logged in');
        }

        return res;
    }

    const getCodeInCookie = () => {
        const cookieValue = document.cookie
                            .split("; ")
                            .find((row) => row.startsWith("client-token="))
                            ?.split("=")[1];

        return cookieValue;
    }
    
    useEffect(() => {
        // const code = getCodeInCookie();
        // if(!code){
            auth();
        // }else{
            // console.log(code)
        //     }
        
      }, [])

    return (
        <div>
123123
        </div>
    )
}
