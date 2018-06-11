const {StringDecoder} = require("string_decoder");
const express = require("express");
const WebSocket = require("ws");
const axios = require('axios');
const libphonenumber = require('libphonenumber-js');
const querystring = require('querystring');
const { google } = require('googleapis');
const GoogleContacts = require('google-contacts-api');

const {WebSocketClient} = require("./client/js/WebSocketClient.js");
const {BootstrapStep}   = require("./client/js/BootstrapStep.js");

const server = express();

let backendWebsocket;

const CLIENT_ID = '993164538042-t8khg7khktt8u391988iubuk7e72psh3.apps.googleusercontent.com';
const CLIENT_SECRET = 'OKBleQniLAPT0KKJHs3ld7ZM';
const REDIRECT_URI = 'http://localhost:2018/authorized';

const credentials ={
	web: {
		client_id: "993164538042-t8khg7khktt8u391988iubuk7e72psh3.apps.googleusercontent.com",
		project_id: "whatsapp-photo-sync",
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://accounts.google.com/o/oauth2/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		client_secret: "OKBleQniLAPT0KKJHs3ld7ZM",
		redirect_uris: ["http://localhost:2018/authorized"]
	}
}

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.google.com/m8/feeds/contacts/default/full',
    'https://www.google.com/m8/feeds/photos/media/default/'
  ]
});

server.get('/contacts', (req, res) => {
    res.redirect(url);
});

server.get('/authorized', (req, res) => {
    const formData =  {
        code: req.query.code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI
    };

    axios.post('https://www.googleapis.com/oauth2/v4/token', querystring.stringify(formData), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).then((response) => {
        const contactsApi = new GoogleContacts({ token : response.data.access_token });
		contactsApi.getContacts({projection: 'full'}, async (err, contacts) => {
			if (err) {
                console.error(err.message);
			}
			
			res.json(await parseContacts(contacts));
		});
    }).catch(err => {
        console.log(err)
        res.send(false)
    });
});

async function parseContacts(contacts) {
	let parsedContacts = contacts.map(contact => {
		let parsedContact = {name: contact.name};

		try {
			if (contact.phones && contact.phones.length > 0) {
				const phone = contact.phones[0].field;
				const number = libphonenumber.parseNumber(phone, 'IL');
				const parsedPhone = libphonenumber.formatNumber(number, 'E.164');
				parsedContact.phone = parsedPhone.substr(1, parsedPhone.length - 1);
			}
		} catch (err) {
		}
			
		return parsedContact
	}).filter(contact => contact.phone);

	// let result = await Promise.all(parsedContacts.map(contact => {
	// 	return getPhoto(contact.phone).then(photo => {
	// 		return Object.assign(contact, { photo: photo.image } );
	// 	});
	// }));

	// return result;

	let parsed = [];

	for (let index = 0; index < 100; index++) {
		const photo = (await getPhoto(parsedContacts[index].phone)).image;
		parsed.push(Object.assign(parsedContacts[index], {photo}));
	}

	return parsed;
}

server.use(express.static("client"));

server.get('/connect', async (req, res) => {
	res.send(await connect());
});

server.get('/photo', async (req, res) => {
	res.send(await getPhoto('972526053444'));
});

server.listen(2018, function() {
	console.log("whatsapp-photo-sync HTTP server listening on port 2018");
});

let backendInfo = {
	url: "ws://localhost:2020",
	timeout: 10000
};

async function connect() {
	try {
		backendWebsocket = new WebSocketClient();

		if(backendWebsocket.isOpen){
			return;
		}

		let backendResponse = await (new BootstrapStep({
			websocket: backendWebsocket,
			actor: websocket => {
				websocket.initialize(backendInfo.url, "api2backend", {func: WebSocket, args: [{ perMessageDeflate: false }], getOnMessageData: msg => new StringDecoder("utf-8").write(msg.data)});
				websocket.onClose(() => {
					throw { type: "resource_gone", resource: "backend" };
				});
			},
			request: {
				type: "waitForMessage",
				condition: obj => obj.from == "backend"  &&  obj.type == "connected"
			}
		}).run(backendInfo.timeout))

		console.log('api connected to backend');

		if(!backendWebsocket.isOpen) {
			return;
		}
		backendResponse = await (new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-connectWhatsApp" },
				successCondition: obj => obj.type == "resource_connected"  &&  obj.resource == "whatsapp"  &&  obj.resource_instance_id
			}
		}).run(backendInfo.timeout));
		
		backendWebsocket.activeWhatsAppInstanceId = backendResponse.data.resource_instance_id;
		backendWebsocket.waitForMessage({
			condition: obj => obj.type == "resource_gone"  &&  obj.resource == "whatsapp",
			keepWhenHit: false
		}).then(() => {
			delete backendWebsocket.activeWhatsAppInstanceId;
			throw { type: "resource_gone", resource: "whatsapp" };
		});

		console.log('backend connected to whatsapp');
		
		if(!backendWebsocket.isOpen) {
			throw { type: "error", reason: "No backend connected." };
		}

		backendResponse = await (new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-generateQRCode", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
				successCondition: obj => obj.from == "backend"  &&  obj.type == "generated_qr_code"  &&  obj.image  &&  obj.content
			}
		}).run(backendInfo.timeout));

		return { type: 'generated_qr_code', image: backendResponse.data.image };
	} catch (error) {
		return { type: "error", reason: error };
	}
}

async function getPhoto(phone) {
	try {
		if(!backendWebsocket.isOpen) {
			throw { type: "error", reason: "No backend connected." };
		}
		let backendResponse = await (new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-getPhoto", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId, phone },
				successCondition: obj => obj.from == "backend"  &&  obj.type == "profile_photo"  &&  obj.image
			}
		}).run(backendInfo.timeout));

		return { type: "profile_photo", image: backendResponse.data.image}
	} catch (error) {
		return { type: "error", reason: error }
	}
}

function disconnect() {
	if(!backendWebsocket.isOpen) {
		throw { type: "error", reason: "No backend connected." };
	}

	new BootstrapStep({
		websocket: backendWebsocket,
		request: {
			type: "call",
			callArgs: { command: "backend-disconnectWhatsApp", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
			successCondition: obj => obj.type == "resource_disconnected"  &&  obj.resource == "whatsapp"  &&  obj.resource_instance_id == backendWebsocket.activeWhatsAppInstanceId
		}
	}).run(backendInfo.timeout)
	.then(backendResponse => {
		console.log({ type: "resource_disconnected", resource: "whatsapp" });
	});
}
