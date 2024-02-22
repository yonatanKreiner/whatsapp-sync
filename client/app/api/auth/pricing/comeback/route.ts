import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { APP_URL, JWT_SECRET } from '@/app/config';
import { PRICING_PLAN } from '@/app/enums';


export async function GET(request: NextRequest) {
  debugger;
    const searchParams = request.nextUrl.searchParams;
    const choosen_plan = searchParams.get('choosen_plan');

    const profile = request.cookies.get("profile")?.value;

    if (!profile) {
      return NextResponse.json('not authenticate with google', { status: 401 });
    }
    if (!choosen_plan) {
      return NextResponse.json('missing choosen plan', { status: 400 });
    }
  
    const profileWithTier = verify(profile, JWT_SECRET);
    (profileWithTier as JwtPayload).profile.PricingTier = choosen_plan as unknown as PRICING_PLAN;
  
    const profileWithTierJWT = sign({ profile: (profileWithTier as JwtPayload).profile }, JWT_SECRET, {
      expiresIn: '2h'
    });

    const url = `${APP_URL}/connect-photos?plan_choose=succeed`;
    console.log(`redirect to: ${url}`);

    const res = NextResponse.redirect(url, { status: 302, });
    res.cookies.set("profile", profileWithTierJWT, {
        httpOnly: true,
        secure: true,
        sameSite: true
    });

    return res;
}