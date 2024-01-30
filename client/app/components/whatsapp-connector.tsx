import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import LoadingAnimation from '../../public/assets/animation_loading.json';
import SucceedAnimation from '../../public/assets/animation_succeed.json';
import QRAnimation from '../../public/assets/animation_qr.json';
import { WHATSAPP_SOCKET_SERVICE } from '../config';

interface IProp {
  setWhatsappContactsData: (whatsappContacts: any[]) => void
}

let whatsappSyncWSRef: WebSocket | null;

export const WhatappConnector = ({ setWhatsappContactsData }: IProp) => {
  const [isLoadContansSucceed, setIsLoadContansSucceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrcode, setQrCode] = useState(null);

  const connectToServerBySocket = () => {
    try {
      const webSocket = new WebSocket(`ws://${WHATSAPP_SOCKET_SERVICE}`);
      whatsappSyncWSRef = webSocket;
      webSocket.onmessage = (event) => {
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
      if (whatsappSyncWSRef && !isLoadContansSucceed && isLoading) {
        whatsappSyncWSRef.close(1000, 'not retrieve data at all');
        whatsappSyncWSRef = null;
        connectToServerBySocket();
      }
    }, 10000)

    return () => {
      if (whatsappSyncWSRef) {
        whatsappSyncWSRef.close(1000, 'done retrieve data');
        whatsappSyncWSRef = null;
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
