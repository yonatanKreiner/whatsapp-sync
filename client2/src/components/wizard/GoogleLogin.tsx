"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const GoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const onClickSignIn = async () => {
    setIsLoading(true);
    const res = await fetch("/api/auth/register");
    console.log(res);

    if (res.status === 200) {
      setIsLoggedIn(true);
      router.push("/wizard/pricing");
    } else if (res.status === 401) {
      router.push(res.headers.get("location")!);
    }

    return res;
  };

  const handleLogin = () => {
    setIsLoading(true);
    onClickSignIn().then(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="text-center">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-google-blue/10">
        <svg
          className="w-8 h-8 text-google-blue"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Connect to Google Contacts
      </h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        We need access to your Google Contacts to update profile images.
        WhatsSync uses secure OAuth and never stores your credentials.
      </p>

      <Button
        onClick={handleLogin}
        disabled={isLoading}
        size="lg"
        className="bg-google-blue hover:bg-google-blue/90 text-white font-medium px-8"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Connect Google Contacts
          </>
        )}
      </Button>

      <div className="mt-8">
        <h3 className="font-medium mb-2">WhatsSync only requests access to:</h3>
        <ul className="text-gray-600 space-y-1">
          <li>• View and update your Google contacts</li>
          <li>• Upload photos to your Google contacts</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleLogin;
