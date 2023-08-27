import { NextRequest, NextResponse } from 'next/server'
import {sign} from 'jsonwebtoken';
import { JWT_SECRET } from '../../oauth-config';

export async function GET(request: NextRequest) {
    const profile = request.cookies.get("profile")?.value;

    const url = `http://${request.nextUrl.host}/people?login=succeed&pricingTier=trial`;
    console.log(`redirect to: ${url}`);

    const pricingToken = sign({ pricingTier: 'trial' }, JWT_SECRET,{
        expiresIn: '2h'
    });

    const res = NextResponse.redirect(url, { status: 302, });
    res.cookies.set("pricing-token", pricingToken, {
        httpOnly: true,
        secure: true,
        sameSite: true
    });

    return res;
}