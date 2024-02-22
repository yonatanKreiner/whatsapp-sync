import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { APP_URL, JWT_SECRET } from '@/app/config';
import { PRICING_PLAN } from '@/app/enums';
import { credentials } from '../../oauth-config';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = new Stripe(credentials.stripe_key);

  const profile = request.cookies.get("profile")?.value;

  if (!profile) {
    return NextResponse.json('not authenticate with google', { status: 401 });
  }

  const { choosen_plan } = await request.json();
  if (!choosen_plan) {
    return NextResponse.json('missing choosen plan', { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `WhatsappSync-${choosen_plan}`,
          },
          unit_amount: GetPricingForPlan(choosen_plan),
        },
        quantity: 1
      },
    ],
    mode: 'payment',
    success_url: `${APP_URL}/api/auth/pricing/comeback?choosen_plan=${choosen_plan}`,
    cancel_url: `${APP_URL}`,
  });


  const res = NextResponse.json('succeed', {
    status: 200, headers: {
      'location': session.url!
    }
  });

  return res;
}

function GetPricingForPlan(pricingPlan: PRICING_PLAN): number {
  switch (pricingPlan) {
    case PRICING_PLAN.PRO:
      return 1500;
    case PRICING_PLAN.EXPERT:
      return 3000;
  }

  return 3000
}