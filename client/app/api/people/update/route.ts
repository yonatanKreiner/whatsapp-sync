import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis';
import axios from 'axios';

const people = google.people('v1');

export async function POST(request: NextRequest) {
  debugger;
  const accessToken = request.cookies.get("client-token")?.value;
  const body = await request.json();
  const { contacts }: any = body;

  if (!contacts) {
    return NextResponse.json({ result: 'failed' }, { status: 400 });
  }

  contacts.filter((x: any) => x.imageURL && x.resourceName)
    .forEach(async (contact: any) => {
      const imageUrl = contact.imageURL;
      const imageUrlData = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      const imageData: string = imageUrlData.data;
      const buffer = Buffer.from(imageData, 'base64');

      const res = await people.people.updateContactPhoto({
        resourceName: contact.resourceName,
        requestBody: {
          photoBytes: buffer.toString('base64')
        },
        access_token: accessToken
      });
      console.log(res);
    });

  return NextResponse.json({ "result": "succeed" }, { status: 200 });
}