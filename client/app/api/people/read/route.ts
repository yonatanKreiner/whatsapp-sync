import { NextRequest, NextResponse } from 'next/server'
import { google, people_v1 } from 'googleapis';

const people = google.people('v1');

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("client-token")?.value;

  const {
    data: { connections },
  } = await people.people.connections.list({
    personFields: 'names,phoneNumbers,photos',
    resourceName: 'people/me',
    pageSize: 10,
    oauth_token: accessToken
  });

  console.log("User's Connection");

  const res = NextResponse.json(connections, { status: 200 });

  return res;
}
