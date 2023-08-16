import { useState } from "react";

export const SignIn = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const onClickSignIn = async () => {
        const res = await fetch('/api/auth/register');
        console.log(res)

        if (res.status == 401) {
            window.document.location = res.headers.get("location")!;
        } else {
            setIsLoggedIn(true);
            console.log('logged in');
        }

        return res;
    }

    return (
        <div>
            {isLoggedIn ? 
                <div>
                    <button onClick={onClickSignIn}>
                        Sign In to Google
                    </button>
                </div>
                : <div>You already logged in</div>}
        </div>
    );
}