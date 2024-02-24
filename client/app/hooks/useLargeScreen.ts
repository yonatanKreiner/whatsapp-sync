import { useEffect, useState } from "react"

export const useLargeScreen = ():boolean => {
    const [isDesktop, setIsDesktop] = useState(true);
    useEffect(() => {
        const mobileOsRegExp = "(Android|webOS|iPhone|iPod)";
        if(screen.width < 500 || navigator.userAgent.match('/'+mobileOsRegExp+'/i')) {
            setIsDesktop(false);
        }
    }, [])

    return isDesktop
}