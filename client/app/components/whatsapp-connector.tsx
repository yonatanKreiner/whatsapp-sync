import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import LoadingAnimation from '../../public/assets/animation_loading.json';
import SucceedAnimation from '../../public/assets/animation_succeed.json';

interface IProp{
  setWhatsappContactsData: (whatsappContacts: any[])=>void
}

export const WhatappConnector = ({setWhatsappContactsData}: IProp) => {
    const [isLoadContansSucceed, setIsLoadContansSucceed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [qrcode, setQrCode] = useState(null);

  const connectToServerBySocket = () => {
    try {
      const webSocket = new WebSocket("ws://localhost:5000");
      webSocket.onmessage = (event) => {
        console.log(event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.qr) {
            setQrCode(data.qr);
          }
          if(data.whatsappContacts) {
            setIsLoadContansSucceed(true);
            setWhatsappContactsData(data.whatsappContacts)
            webSocket.close(200, 'done retrieve data');
          }
        } catch (e) {
          console.log(e)
        }
      }
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    connectToServerBySocket();
  }, [])

  return (
    <div>
      {isLoadContansSucceed ? 
        <div>
          <Lottie style={{width:"15%",height:"15%"}}  animationData={SucceedAnimation} />
          Succeed fetch images from whatsapp</div> 
        : qrcode ?
            <QRCodeSVG value={qrcode} />
            : <>no code available yet!</>
      }
    </div>
  )
}
