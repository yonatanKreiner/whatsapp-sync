const {StringDecoder} = require("string_decoder");
const express = require("express");
const WebSocket = require("ws");

const googleContacts = require('./googleContacts');

const {WebSocketClient} = require("./client/js/WebSocketClient.js");
const {BootstrapStep}   = require("./client/js/BootstrapStep.js");

const port = process.env.PORT || 2018;

const server = express();

const backendInfo = {
	url: `ws://${process.env.BACKEND || 'localhost'}:2020`,
	timeout: 10000
};

let backendWebsockets = {};

server.get('/contacts', (req, res) => {
    res.redirect(googleContacts.getUrl(req.query.id));
});

server.get('/authorized', async (req, res) => {	
	const accessToken = await googleContacts.getAccessToken(req.query.code);
	
	if (accessToken === null) {
		res.json('fail');
	} else {
		googleContacts.getContacts(accessToken, async (contacts) => {
			updatePhotos(req.query.state, contacts, accessToken);
			res.json('executing');
		});
	}
});

async function updatePhotos(id, contacts, accessToken) {
	const parsedContacts = await googleContacts.parseContacts(contacts);
	let failedContacts = [];

	for (let index = 0; index < parsedContacts.length; index++) {
		const photo = (await getPhoto(id, parsedContacts[index].phone)).image;
		const contact = Object.assign(parsedContacts[index], {photo});

		if (contact.photo !== 404 && contact.photo !== 401) {
            await googleContacts.updatePhoto(contact, accessToken);
        } else {
            failedContacts.push(contact);
        }
	}

	console.log('finished');

	return failedContacts;
}

server.use(express.static("client"));

server.get('/connect', async (req, res) => {
	res.send(await connect(req.query.id));
});

server.listen(port, function() {
	console.log(`whatsapp-photo-sync HTTP server listening on port ${port}`);
});

async function connect(id) {
	try {
		backendWebsockets[id] = new WebSocketClient();
		let backendWebsocket = backendWebsockets[id];

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

async function getPhoto(id, phone) {
	try {
		let backendWebsocket = backendWebsockets[id];

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
