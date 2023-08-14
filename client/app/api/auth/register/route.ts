import { NextRequest, NextResponse } from 'next/server'

import { google } from 'googleapis';

const credentials = {
    client_id: "524139804888-5pmtubbjouds99tioias0b6amipak52f.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uri: process.env.REDIRECT || "http://localhost:3000/api/auth/comeback"
}

async function googleAuth() {
    const oauth2Client = new google.auth.OAuth2({
        clientId: credentials.client_id,
        clientSecret: credentials.client_secret,
        redirectUri: credentials.redirect_uri
    });
    const scopes = ['https://www.googleapis.com/auth/contacts'];

    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: scopes
    });

    console.log(`url: ${url}`)
    return url;
}


export async function GET(request: NextRequest) {
    const code = request.cookies.get("client-token")?.value;
    console.log(`current code: ${code}`);
    if (code) {
        return new Response("already in", {
            status: 200,
        });
    }

    const url = await googleAuth();

    return new Response("auth required", {
        status: 401,
        headers: { 'location': `${url}` },
    });
}