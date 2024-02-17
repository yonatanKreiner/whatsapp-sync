import { PricingTiers } from './../../../components/pricing-tiers';
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis';
import { JwtPayload, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/app/config';
import { PRICING_PLAN } from '@/app/enums';

const people = google.people('v1');

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("client-token")?.value;
  const profileToken = request.cookies.get("profile")?.value;
  if(!profileToken){
    NextResponse.json('not authenticated', {status: 401});
  }
  const profileWithTier = verify(profileToken!, JWT_SECRET);
  const pricingPlan = (profileWithTier as JwtPayload).profile.PricingTier as PRICING_PLAN;

  const peoplePageSize = GetDesiredPageSize(pricingPlan);

  const {
    data: { connections },
  } = await people.people.connections.list({
    personFields: 'names,phoneNumbers,photos',
    resourceName: 'people/me',
    pageSize: peoplePageSize,
    oauth_token: accessToken
  });

  const contacts = connections?.filter(x => x.phoneNumbers && x.phoneNumbers.length > 0);

  console.log("User's Connection");

  const res = NextResponse.json(contacts, { status: 200 });

  return res;
}

function GetDesiredPageSize(pricingPlan: PRICING_PLAN): number{
  switch(pricingPlan){
    case PRICING_PLAN.TRIAL: 
      return 15;
    case PRICING_PLAN.PRO: 
         return 250;
    case PRICING_PLAN.EXPERT:
        return 1000;
  }

  return 0;
}