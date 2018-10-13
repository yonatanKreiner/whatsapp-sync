const querystring = require('querystring');
const axios = require('axios');
const libphonenumber = require('libphonenumber-js');
const { google } = require('googleapis');
const GoogleContacts = require('google-contacts-api-wrapper');

const credentials = {
    client_id: "993164538042-t8khg7khktt8u391988iubuk7e72psh3.apps.googleusercontent.com",
    project_id: "whatsapp-photo-sync",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://accounts.google.com/o/oauth2/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "OKBleQniLAPT0KKJHs3ld7ZM",
    redirect_uris: [process.env.REDIRECT || "http://localhost:2018/authorized"]
}

const oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0]
);

function getUrl(id) {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.google.com/m8/feeds/contacts/default/full',
          'https://www.google.com/m8/feeds/photos/media/default/'
        ],
        state: id
      });
}

async function getAccessToken(code) {
    const formData =  {
        code,
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        grant_type: 'authorization_code',
        redirect_uri: credentials.redirect_uris[0]
    };

    try {
        const response = await axios.post('https://www.googleapis.com/oauth2/v4/token', querystring.stringify(formData), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        return response.data.access_token;
    } catch (err) {
        console.log('failed getting token');
        console.error(err.stack);
        return null;
    }
}

function getContacts(accessToken, callback) {
    const contactsApi = new GoogleContacts({ token: accessToken });
	contactsApi.getContacts({projection: 'full'}, (err, contacts) => {
		if (err) {
			console.error(err.message);
        }
        
        callback(contacts);
	});
}

function parseContacts(contacts) {
	let parsedContacts = contacts.map(contact => {
		let parsedContact = {name: contact.name, photoUrl: contact.photo};

		try {
			if (contact.phones && contact.phones.length > 0) {
				const phone = contact.phones[0].field;
				const number = libphonenumber.parseNumber(phone, 'IL');
				const parsedPhone = libphonenumber.formatNumber(number, 'E.164');
				parsedContact.phone = parsedPhone.substr(1, parsedPhone.length - 1);
			}
		} catch (err) {
            console.error(contact.phones[0].field);
		}
			
		return parsedContact
    }).filter(contact => contact.phone);
    
    return parsedContacts;
}

async function updatePhoto(contact, token) {
	headers = {
		'Content-Type': 'image/jpeg',
		'Authorization': 'Bearer ' + token,
		'If-Match': '*'
	}

    try {
        const response = await axios.get(contact.photo, { responseType: 'arraybuffer' });
        const picture = new Buffer.from(response.data, 'binary');
        await axios.put(contact.photoUrl, picture, {headers: headers});
    } catch (err) {
        console.error(err)
        console.error('failed update ' + contact.name);
    }
}

module.exports = { getUrl, getAccessToken, getContacts, parseContacts, updatePhoto };