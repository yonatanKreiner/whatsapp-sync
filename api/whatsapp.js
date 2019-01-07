const WebSocket = require("ws");
const {StringDecoder} = require("string_decoder");

const {WebSocketClient} = require("./client/js/WebSocketClient.js");
const {BootstrapStep}   = require("./client/js/BootstrapStep.js");
const log = require('./log');

const backendInfo = {
	url: `ws://${process.env.BACKEND || 'localhost:2020'}`,
	timeout: 10000
};
let backendWebsockets = {};

async function connect(id) {
	if (!backendWebsockets.hasOwnProperty(id)) {
		backendWebsockets[id] = new WebSocketClient();
	}

	let backendWebsocket = backendWebsockets[id];		
	
	if(backendWebsocket.isOpen){
		return;
	}

	await (new BootstrapStep({
		websocket: backendWebsocket,
		actor: websocket => {
			websocket.initialize(backendInfo.url, "api2backend", {func: WebSocket, args: [{ perMessageDeflate: false }], getOnMessageData: msg => new StringDecoder("utf-8").write(msg.data)});
			websocket.onClose(() => {
				log(3, 'backend disconnected');
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
	
	const connectResponse = await (new BootstrapStep({
		websocket: backendWebsocket,
		request: {
			type: "call",
			callArgs: { command: "backend-connectWhatsApp" },
			successCondition: obj => obj.type == "resource_connected"  &&  obj.resource == "whatsapp"  &&  obj.resource_instance_id
		}
	}).run(backendInfo.timeout));
	
	log(3, `whatsapp conected with id ${connectResponse.data.resource_instance_id}`);
	
	backendWebsocket.activeWhatsAppInstanceId = connectResponse.data.resource_instance_id;
	
	backendWebsocket.waitForMessage({
		condition: obj => obj.type == "resource_gone"  &&  obj.resource == "whatsapp",
		keepWhenHit: false
	}).then((disconnectResponse) => {
		log(3, `whatsapp disconected with id ${disconnectResponse.data.resource_instance_id}`);
		delete backendWebsocket.activeWhatsAppInstanceId;
	});
	
	if(!backendWebsocket.isOpen) {
		log(1, 'could not generate QR, no backend connected');
	}

	const qrcodeResponse = await (new BootstrapStep({
		websocket: backendWebsocket,
		request: {
			type: "call",
			callArgs: { command: "backend-generateQRCode", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
			successCondition: obj => obj.from == "backend"  &&  obj.type == "generated_qr_code"  &&  obj.image  &&  obj.content
		}
	}).run(backendInfo.timeout));
	
	log(3, `qrcode generated for connection id- ${connectResponse.data.resource_instance_id}`);

	return { image: qrcodeResponse.data.image };
}

async function refreshQR(id) {
	let backendWebsocket = backendWebsockets[id];

	if(!backendWebsocket || !backendWebsocket.isOpen) {
		log(1, 'could not refresh QR code no backend connected');
	}

	let backendResponse = await (new BootstrapStep({
		websocket: backendWebsocket,
		request: {
			type: "call",
			callArgs: { command: "backend-regenerateQRCode", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
			successCondition: obj => obj.from == "backend"  &&  obj.type == "generated_qr_code"  &&  obj.image
		}
	}).run(backendInfo.timeout));

	return { image: backendResponse.data.image };
}

async function getPhoto(id, phone) {
	let backendWebsocket = backendWebsockets[id];

	if(!backendWebsocket || !backendWebsocket.isOpen) {
		log(1, 'could not get photo, no backend connected');
	}

	let backendResponse = await (new BootstrapStep({
		websocket: backendWebsocket,
		request: {
			type: "call",
			callArgs: { command: "backend-getPhoto", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId, phone },
			successCondition: obj => obj.from == "backend"  &&  obj.type == "profile_photo"  &&  obj.image
		}
	}).run(backendInfo.timeout));

	return backendResponse.data.image;
}

async function getWhatsappNumber(id) {
	const backendWebsocket = backendWebsockets[id];

	if(!backendWebsocket || !backendWebsocket.isOpen) {
		log(1, 'could not disconnect from whatsapp, no backend connected');
	}

	const res = await (new BootstrapStep({
		websocket: backendWebsocket,
		request: {
			type: "call",
			callArgs: { command: "backend-getConnectionInfo", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
			successCondition: obj => obj.type == "connection_info"  &&  obj.wid
		}
	}).run(backendInfo.timeout));

	return res.data.wid;
}

async function disconnect(id) {
	const backendWebsocket = backendWebsockets[id];

	if(!backendWebsocket || !backendWebsocket.isOpen) {
		log(1, 'could not disconnect from whatsapp, no backend connected');
	}

	const disconnectResponse = await (new BootstrapStep({
		websocket: backendWebsocket,
		request: {
			type: "call",
			callArgs: { command: "backend-disconnectWhatsApp", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
			successCondition: obj => obj.type == "resource_disconnected"  &&  obj.resource == "whatsapp"  &&  obj.resource_instance_id == backendWebsocket.activeWhatsAppInstanceId
		}
	}).run(backendInfo.timeout));

	log(3, `whatsapp disconected with id ${disconnectResponse.data.resource_instance_id}`);
}

module.exports = { connect, refreshQR, getPhoto, getWhatsappNumber, disconnect };