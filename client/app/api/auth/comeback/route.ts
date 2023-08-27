import { NextRequest, NextResponse } from 'next/server'
import { oauth2Client, credentials, JWT_SECRET } from '../oauth-config';
import { sign } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    const { tokens } = await oauth2Client.getToken({
        code: code!,
        client_id: credentials.client_id,
        redirect_uri: credentials.redirect_uri
    });
    const { email, user_id} = await oauth2Client.getTokenInfo(tokens.access_token!);
    const profile = sign({ profile: {email, user_id} }, JWT_SECRET,{
        expiresIn: '2h'
    });

    const url = `http://${request.nextUrl.host}/people?login=succeed`;
    console.log(`redirect to: ${url}`);

    const res = NextResponse.redirect(url, { status: 302, });
    res.cookies.set("client-token", tokens.access_token!, {
        expires: tokens.expiry_date!,
        httpOnly: true,
        secure: true,
        sameSite: true
    });
    res.cookies.set("profile", profile, {
        httpOnly: true,
        secure: true,
        sameSite: true
    });

    return res;
}