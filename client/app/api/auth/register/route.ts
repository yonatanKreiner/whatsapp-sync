import { NextRequest, NextResponse } from 'next/server'

import { oauth2Client, scopes } from '../oauth-config';

async function googleAuth() {
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