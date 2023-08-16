"use client"

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

export const WhatappConnector = () => {
    const [isLoadContansSucceed,setIsLoadContansSucceed] = useState(false);
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
        <>Succeed fetch images from whatsapp</> 
        : qrcode ?
            <QRCodeSVG value={qrcode} />
            : <>no code available yet!</>
      }
    </div>
  )
}
