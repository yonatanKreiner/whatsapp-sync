import { NextRequest, NextResponse } from 'next/server'
import { oauth2Client, credentials } from '../oauth-config';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');


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