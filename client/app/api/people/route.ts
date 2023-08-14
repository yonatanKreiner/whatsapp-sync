import { NextRequest, NextResponse } from 'next/server'
import {google} from 'googleapis';

const people = google.people('v1');

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get("client-token")?.value;
    console.log(accessToken);
    
    const {
        data: {connections},
      } = await people.people.connections.list({
        personFields: 'names',
        resourceName: 'people/me',
        pageSize: 10,
        oauth_token: accessToken
      });

      console.log("\n\nUser's Connections:\n");
      connections?.forEach((c: any) => console.log(c));


    return new Response('succeed authenticate', {
        status: 200,
    });
}