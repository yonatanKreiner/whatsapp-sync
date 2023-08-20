import { useEffect, useState } from "react";


export const SignIn = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const onClickSignIn = async () => {
        const res = await fetch('/api/auth/register');
        console.log(res)

        if(res.status === 200){
            setIsLoggedIn(true);
        }else if(res.status === 401){
            document.location = res.headers.get("location")!;
        }

        return res;
    }

    useEffect(() => {
        if(document.URL.includes('succeed')){
            setIsLoggedIn(true);
        }
    });

    return (
        <div>
            {!isLoggedIn ? 
                <div>
                    <button onClick={onClickSignIn}>
                        Sign In to Google
                    </button>
                </div>
                : <div>You already logged in</div>}
        </div>
    );
}