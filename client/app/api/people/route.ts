import { NextRequest, NextResponse } from 'next/server'
import {google} from 'googleapis';

const credentials = {
    client_id: "524139804888-5pmtubbjouds99tioias0b6amipak52f.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uri: process.env.REDIRECT || "http://localhost:3000/api/auth/comeback"
}

const people = google.people('v1');

export async function GET(request: NextRequest) {
    // const oauth2Client = new google.auth.OAuth2({clientId: credentials.client_id, clientSecret: credentials.client_secret, redirectUri: credentials.redirect_uri});
    // const scopes = ['https://www.googleapis.com/auth/contacts'];

    const accessToken = request.cookies.get("client-token")?.value;
    console.log(accessToken);
    // const {tokens} = await oauth2Client.getToken(code!);
    // console.log(`token: ${tokens}`)
    // oauth2Client.setCredentials(tokens);

    // google.options({auth: oauth2Client });

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