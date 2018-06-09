let _ = require("lodash");
let fs = require("fs");
let path = require("path");
let {StringDecoder} = require("string_decoder");
let express = require("express");
let WebSocket = require("ws");

let {WebSocketClient} = require("./client/js/WebSocketClient.js");
let {BootstrapStep}   = require("./client/js/BootstrapStep.js");

let server = express();

let backendWebsocket;

server.use(express.static("client"));

server.get('/connect', async (req, res) => {
	res.send(await connect());
});

server.get('/photo', async (req, res) => {
	res.send(await getPhoto('972526053444'));
})

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
