import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import LoadingAnimation from '../../public/assets/animation_loading.json';
import SucceedAnimation from '../../public/assets/animation_succeed.json';
import Swal from "sweetalert2";

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
        if(res.status == 401){
            Swal.fire(
                'did you logged in to you google acount?',
                'Please try login to your acount',
                'question'
            )

            return;
        }
        
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
        <div style={{display: 'flex', justifyContent: 'center'}}>
            {isLoadContansSucceed ?
                <div>
                    <Lottie loop={false} autoPlay animationData={SucceedAnimation} />
                    Succeed load contacts from google!
                </div> : <Lottie style={{width:"15%",height:"15%"}}  animationData={LoadingAnimation} />}
        </div>
    );
}