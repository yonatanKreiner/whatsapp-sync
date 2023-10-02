import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import LoadingAnimation from '../../public/assets/animation_loading.json';

export const SignIn = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onClickSignIn = async () => {
        setIsLoading(true);
        const res = await fetch('/api/auth/register');
        console.log(res)

        if (res.status === 200) {
            setIsLoggedIn(true);
        } else if (res.status === 401) {
            document.location = res.headers.get("location")!;
        }

        setIsLoading(false);

        return res;
    }

    useEffect(() => {
        if (document.URL.includes('succeed')) {
            setIsLoggedIn(true);
        }
    });

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            {isLoading ? <Lottie style={{width:"15%",height:"15%"}}  animationData={LoadingAnimation} /> :
                !isLoggedIn ?
                    <div>
                        <button onClick={onClickSignIn}>
                            Sign In to Google
                        </button>
                    </div>
                    : <div>You already logged in</div>}
        </div>
    );
}