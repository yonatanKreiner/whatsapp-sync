const {StringDecoder} = require("string_decoder");
const express = require("express");
const WebSocket = require("ws");

const googleContacts = require('./googleContacts');

const {WebSocketClient} = require("./client/js/WebSocketClient.js");
const {BootstrapStep}   = require("./client/js/BootstrapStep.js");

const port = process.env.PORT || 8080;

const server = express();

server.set('view engine', 'ejs');
server.set('views', 'client/views');

const backendInfo = {
	url: `ws://${process.env.BACKEND || 'localhost:2020'}`,
	timeout: 10000
};

let backendWebsockets = {};
let userContacts = {};

server.use(express.static("client"));

server.get('/progress', (req, res) => {
	const id = req.query.id;
	if (userContacts.hasOwnProperty(id)) {
		const percentage = parseInt(userContacts[id].index / userContacts[id].parsedContacts.length * 100)
		res.json({percentage});
	} else {
		res.status(200).send('No such user');
	}
});

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
			res.render('finish', {user: req.query.state});
		});
	}
});

async function updatePhotos(id, contacts, accessToken) {
	try	{
		userContacts[id] = {
			parsedContacts: await googleContacts.parseContacts(contacts),
			failedContacts: []
		};
	
		for (let index = 0; index < userContacts[id].parsedContacts.length; index++) {
			userContacts[id].index = index;
			let contact = userContacts[id].parsedContacts[index];
			contact.photo = (await getPhoto(id, contact.phone)).image;
	
			if (contact.photo !== 404 && contact.photo !== 401) {
				await googleContacts.updatePhoto(contact, accessToken);
			} else {
				userContacts[id].failedContacts.push(contact);
			}
		}
	
		delete userContacts[id];
	} catch (err) {
		console.log('error updating photos: ' + err.message);
	}
}

server.get('/connect', async (req, res) => {
	res.send(await connect(req.query.id));
});

server.get('/refresh', async (req, res) => {
	res.send(await refreshQR(req.query.id));
});

server.get('/disconnect', async (req, res) => {
	res.send(await disconnect(req.query.id));
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
		}).run(backendInfo.timeout));

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

async function refreshQR(id) {
	try {
		let backendWebsocket = backendWebsockets[id];

		if(!backendWebsocket.isOpen) {
			throw { type: "error", reason: "No backend connected." };
		}

		let backendResponse = await (new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-regenerateQRCode", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
				successCondition: obj => obj.from == "backend"  &&  obj.type == "generated_qr_code"  &&  obj.image
			}
		}).run(backendInfo.timeout));

		return { type: 'generated_qr_code', image: backendResponse.data.image };
	} catch (error) {
		return { type: "error", reason: error }
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

async function disconnect(id) {
	try {
		let backendWebsocket = backendWebsockets[id];

		if(!backendWebsocket.isOpen) {
			throw { type: "error", reason: "No backend connected." };
		}
	
		let backendResponse = await (new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-disconnectWhatsApp", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
				successCondition: obj => obj.type == "resource_disconnected"  &&  obj.resource == "whatsapp"  &&  obj.resource_instance_id == backendWebsocket.activeWhatsAppInstanceId
			}
		}).run(backendInfo.timeout));
	
		return { type: "resource_disconnected", resource: "whatsapp" };
	} catch (error) {
		return { type: "error", reason: error };
	}
}
