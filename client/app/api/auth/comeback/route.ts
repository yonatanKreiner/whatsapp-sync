import { NextRequest, NextResponse } from 'next/server'
 
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const url = `http://${request.nextUrl.host}/people`;
    console.log(`redirect to: ${url}`);

    const res = NextResponse.redirect( url, {status: 302, });
    res.cookies.set("client-token", code!, {httpOnly: true, secure: true, sameSite: true});

    return res;
}