import { NextRequest, NextResponse } from 'next/server'
import {JwtPayload, sign, verify} from 'jsonwebtoken';
import { JWT_SECRET } from '../../oauth-config';

export async function GET(request: NextRequest) {
    const profile = request.cookies.get("profile")?.value;

    if(!profile){
        return NextResponse.json('not authenticate with google', {status: 401});
    }
    
    const profileWithTier = verify(profile, JWT_SECRET);
    (profileWithTier as JwtPayload).profile.PricingTier = 'triel';

    const profileWithTierJWT = sign({ profile: (profileWithTier as JwtPayload).profile }, JWT_SECRET,{
        expiresIn: '2h'
    });

    const res = NextResponse.json('succeed acuiring trial', { status: 200, });
    res.cookies.set("profile", profileWithTierJWT, {
        httpOnly: true,
        secure: true,
        sameSite: true
    });

    return res;
}