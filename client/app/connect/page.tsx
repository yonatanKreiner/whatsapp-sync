"use client"

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';


export default function Page() {
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
      {qrcode ?
        <QRCodeSVG value={qrcode} />
        : <>no code yet!</>
      }
    </div>
  )
}
