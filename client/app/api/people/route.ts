import { NextRequest, NextResponse } from 'next/server'
import {google, people_v1} from 'googleapis';

const people = google.people('v1');

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("client-token")?.value;
  
  const {
      data: {connections},
    } = await people.people.connections.list({
      personFields: 'names,phoneNumbers',
      resourceName: 'people/me',
      pageSize: 10,
      oauth_token: accessToken
    });

  console.log("User's Connection");

  const res = NextResponse.json(connections, {status: 200});

  return res;
}

export async function POST(request: NextRequest){
  const accessToken = request.cookies.get("client-token")?.value;
  const {contacts, newcontactsimages} = request.body;
  
  const image = null;
  contacts.forEach((contact: any) => {
    people.people.updateContactPhoto({resourceName: contact.resourceName,requestBody: {photoBytes: image}, access_token: accessToken})  
  });
  


}