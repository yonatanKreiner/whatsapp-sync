import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis';

const people = google.people('v1');

export async function GET(request: NextRequest) {
  debugger;
  const accessToken = request.cookies.get("client-token")?.value;

  const {
    data: { connections },
  } = await people.people.connections.list({
    personFields: 'names,phoneNumbers,photos',
    resourceName: 'people/me',
    pageSize: 15,
    oauth_token: accessToken
  });

  const contacts = connections?.filter(x => x.phoneNumbers && x.phoneNumbers.length > 0);

  console.log("User's Connection");

  const res = NextResponse.json(contacts, { status: 200 });

  return res;
}
