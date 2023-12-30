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

  const updatePromises: Promise<any>[] = contacts.filter((x: any) => x.imageURL && x.resourceName)
    .map((x: any) => updateContactPhoto(x, accessToken!));

  const updateResults = await Promise.all(updatePromises);


  const isSucceedPartially = updateResults.some(r => r.updateResult);
  const isSucceedFully = updateResults.every(r => r.updateResult);

  return isSucceedFully ? NextResponse.json({ "result": "succeed, update all contacts requested" }, { status: 200 }) :
    isSucceedPartially ? NextResponse.json({ "result": "partialy succeed, failed to update some of the contacts" }, { status: 200 }) :
      NextResponse.json({ "result": "failed, failed to update contacts" }, { status: 500 });
}

const updateContactPhoto = async (contact: any, accessToken: string) => {
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


  return { resourceName: res.data.person?.resourceName, updateResult: res.status == 200 }
}