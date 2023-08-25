import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import LoadingAnimation from '../../public/assets/animation_loading.json';
import SucceedAnimation from '../../public/assets/animation_succeed.json';
import QRAnimation from '../../public/assets/animation_qr.json';

interface IProp {
  setWhatsappContactsData: (whatsappContacts: any[]) => void
}

export const WhatappConnector = ({ setWhatsappContactsData }: IProp) => {
  const [isLoadContansSucceed, setIsLoadContansSucceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrcode, setQrCode] = useState(null);
  const [whatsappSyncWS, setWhatsappSyncWS] = useState<WebSocket | null>(null)

  const connectToServerBySocket = () => {
    try {
      const webSocket = new WebSocket("ws://localhost:5000");
      setWhatsappSyncWS(webSocket);
      webSocket.onmessage = (event) => {
        debugger;
        console.log(event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.qr) {
            setQrCode(data.qr);
          }
          if (data.whatsappContacts) {
            setIsLoadContansSucceed(true);
            setIsLoading(false);
            setWhatsappContactsData(data.whatsappContacts)
            webSocket.close(200, 'done retrieve data');
            setWhatsappSyncWS(null);
          }
          if (data.connection == 'open') {
            setIsLoading(true);
          }
        } catch (e) {
          console.log(e)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    connectToServerBySocket();

    setTimeout(() => {
      if (whatsappSyncWS && isLoadContansSucceed && isLoading) {
        whatsappSyncWS.send('didntRecieveAnyContacts')
      }
    }, 6000)

    return () => {
      if (whatsappSyncWS) {
        whatsappSyncWS.close();
      }
    }
  }, [])

  return (
    <div style={{display: 'flex',justifyContent:'center'}}>
      {
        isLoading ? <Lottie style={{ width: "15%", height: "15%" }} animationData={LoadingAnimation} /> :
          isLoadContansSucceed ?
            <div>
              <Lottie loop={false} autoPlay animationData={SucceedAnimation} />
              Succeed fetch images from whatsapp</div>
            : qrcode ?
              <QRCodeSVG value={qrcode} />
              : <Lottie style={{ width: "25%", height: "25%" }} animationData={QRAnimation} />
      }
    </div>
  )
}
