import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis';

const credentials = {
    client_id: "524139804888-5pmtubbjouds99tioias0b6amipak52f.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uri: process.env.REDIRECT || "http://localhost:3000/api/auth/comeback"
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    const oauth2Client = new google.auth.OAuth2({
        clientId: credentials.client_id,
        clientSecret: credentials.client_secret,
        redirectUri: credentials.redirect_uri,
    });
    const scopes = ['https://www.googleapis.com/auth/contacts'];

    console.log(code);
    const { tokens } = await oauth2Client.getToken({
        code: code!,
        client_id: credentials.client_id,
        redirect_uri: credentials.redirect_uri
    });
    console.log(`token: ${tokens}`)

    const url = `http://${request.nextUrl.host}/people`;
    console.log(`redirect to: ${url}`);

    const res = NextResponse.redirect(url, { status: 302, });
    res.cookies.set("client-token", tokens.access_token!, {
        expires: tokens.expiry_date!,
        httpOnly: true,
        secure: true,
        sameSite: true
    });

    return res;
}