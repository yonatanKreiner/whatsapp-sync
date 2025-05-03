"use client";

import React, { useState, useEffect } from "react";
import { WHATSAPP_SOCKET_SERVICE } from "@/app/config";
import { QRCodeSVG } from "qrcode.react";
import Lottie from "lottie-react";
import LoadingAnimation from "../../../public/assets/animation_loading.json";
import SucceedAnimation from "../../../public/assets/animation_succeed.json";
import QRAnimation from "../../../public/assets/animation_qr.json";
import { SessionStorageKeys, sessionStorageUtil } from "@/lib/sessionStorage";
import { useRouter } from "next/navigation";

let whatsappSyncWSRef: WebSocket | null;

const WhatsAppLogin = () => {
  const [whatsappContactsData, setWhatsappContactsData] = useState<
    any[] | undefined
  >(undefined);

  const [isLoadContansSucceed, setIsLoadContansSucceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
            sessionStorageUtil.setItem(SessionStorageKeys.WHATSAPP_CONTACTS, data.whatsappContacts);
            router.push("/wizard/pricing");
          }
          if (data.connection == "open") {
            setIsLoading(true);
          }
        } catch (e) {
          console.log(e);
        }
      };
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    connectToServerBySocket();

    setTimeout(() => {
      if (whatsappSyncWSRef && !isLoadContansSucceed && isLoading) {
        whatsappSyncWSRef.close(1000, "not retrieve data at all");
        whatsappSyncWSRef = null;
        connectToServerBySocket();
      }
    }, 10000);

    return () => {
      if (whatsappSyncWSRef) {
        whatsappSyncWSRef.close(1000, "done retrieve data");
        whatsappSyncWSRef = null;
      }
    };
  }, []);

  return (
    <div className="text-center">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-whatsapp/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-whatsapp"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Connect to WhatsApp
      </h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Scan the QR code with WhatsApp on your phone to access your contact
        profile images.
      </p>

      <div className="max-w-xs mx-auto mb-8">
        <div className="aspect-square bg-white rounded-md border border-gray-200 flex items-center justify-center">
          <div style={{ display: "flex", justifyContent: "center" }}>
            {isLoading ? (
              <Lottie
                style={{ width: "15%", height: "15%" }}
                animationData={LoadingAnimation}
              />
            ) : isLoadContansSucceed ? (
              <div>
                <Lottie
                  loop={false}
                  autoPlay
                  animationData={SucceedAnimation}
                />
                Succeed fetch images from whatsapp
              </div>
            ) : qrcode ? (
              <QRCodeSVG value={qrcode} />
            ) : (
              <Lottie
                style={{ width: "25%", height: "25%" }}
                animationData={QRAnimation}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-lg mx-auto">
        <h3 className="font-medium mb-2">How to scan:</h3>
        <ol className="text-gray-600 text-left ml-4 space-y-2">
          <li>1. Open WhatsApp on your phone</li>
          <li>
            2. Tap Menu or Settings and select <strong>Linked Devices</strong>
          </li>
          <li>3. Point your phone at this screen to capture the code</li>
        </ol>

        <div className="mt-6 text-xs text-gray-500">
          Note: WhatsSync uses WhatsApp Web API and does not store any messages
          or personal conversations.
        </div>
      </div>
    </div>
  );
};

export default WhatsAppLogin;
