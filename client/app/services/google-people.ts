import axios from 'axios';
import { getCookie } from './cookie-service';

export enum ResultStatus {
    SUCCEED,
    PARTIALLY_SUCCEED,
    FAILED
}

const chunks = (array: any[], size: number) =>
    Array.from(
        new Array(Math.ceil(array.length / size)),
        (_, i) => array.slice(i * size, i * size + size)
    );

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function UpdateContactsProfilesPhotos(contacts: any[]): Promise<ResultStatus> {
    const updateResults = []
    const accessToken = getCookie('client-token')

    if (!contacts) {
        return ResultStatus.FAILED
    }

    const chunkedContacts = chunks(contacts.filter((x: any) => x.imageURL && x.resourceName), 3);
    for await(const chunk of chunkedContacts){
        const updatePromises: Promise<any>[] =
            chunk.map((x: any) => updateContactPhoto(x, accessToken!)); 
        updateResults.push(...await Promise.all(updatePromises));
        
        await delay(750)
    }

    const isSucceedPartially = updateResults.some(r => r.updateResult);
    const isSucceedFully = updateResults.every(r => r.updateResult);

    return isSucceedFully ? ResultStatus.SUCCEED :
        isSucceedPartially ? ResultStatus.PARTIALLY_SUCCEED :
            ResultStatus.FAILED;
}

const updateContactPhoto = async (contact: any, accessToken: string) => {
    const imageUrl = contact.imageURL;
    const imageUrlData = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    const imageData: string = imageUrlData.data;
    const buffer = Buffer.from(imageData, 'base64');

    const res = await axios.patch(`https://people.googleapis.com/v1/${contact.resourceName}:updateContactPhoto`, {
        photoBytes: buffer.toString('base64'),
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return { resourceName: res.data.person?.resourceName, updateResult: res.status == 200 }
}