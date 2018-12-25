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
	try {
		backendWebsockets[id] = new WebSocketClient();
		let backendWebsocket = backendWebsockets[id];

		if(backendWebsocket.isOpen){
			return;
		}

		await (new BootstrapStep({
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
        
		const connectResponse = await (new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-connectWhatsApp" },
				successCondition: obj => obj.type == "resource_connected"  &&  obj.resource == "whatsapp"  &&  obj.resource_instance_id
			}
        }).run(backendInfo.timeout));
        
        log(`whatsapp conected with id ${connectResponse.data.resource_instance_id}`);
		
		backendWebsocket.activeWhatsAppInstanceId = connectResponse.data.resource_instance_id;
        
        backendWebsocket.waitForMessage({
			condition: obj => obj.type == "resource_gone"  &&  obj.resource == "whatsapp",
			keepWhenHit: false
		}).then((disconnectResponse) => {
            log(`whatsapp disconected with id ${disconnectResponse.data.resource_instance_id}`);
            delete backendWebsocket.activeWhatsAppInstanceId;
		});
		
		if(!backendWebsocket.isOpen) {
			throw new Error('Can\'t generate QR, no backend connected');
		}

		const qrcodeResponse = await (new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-generateQRCode", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
				successCondition: obj => obj.from == "backend"  &&  obj.type == "generated_qr_code"  &&  obj.image  &&  obj.content
			}
        }).run(backendInfo.timeout));
        
        log('generated qrcode');

		return { image: qrcodeResponse.data.image };
	} catch (err) {
        log('could not connect', err);
	}
}

async function refreshQR(id) {
	try {
		let backendWebsocket = backendWebsockets[id];

		if(!backendWebsocket.isOpen) {
			throw new Error('Can\'t refresh QR, no backend connected');
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
	} catch (err) {
        log('could refresh QR code', err);
	}
}

async function getPhoto(id, phone) {
	try {
		let backendWebsocket = backendWebsockets[id];

		if(!backendWebsocket.isOpen) {
			throw new Error('can\'t get photo, no backend connected');
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
	} catch (err) {
        log('could not get photo', err);
	}
}

async function disconnect(id) {
	try {
		const backendWebsocket = backendWebsockets[id];

		if(!backendWebsocket.isOpen) {
			throw new Error('can\'t disconnect, no backend connected');
		}
	
		const disconnectResponse = await (new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-disconnectWhatsApp", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
				successCondition: obj => obj.type == "resource_disconnected"  &&  obj.resource == "whatsapp"  &&  obj.resource_instance_id == backendWebsocket.activeWhatsAppInstanceId
			}
        }).run(backendInfo.timeout));

        log(`whatsapp disconected with id ${disconnectResponse.data.resource_instance_id}`);
	} catch (err) {
		log('could not disconnect from whatsapp', err);
	}
}

module.exports = { connect, refreshQR, getPhoto, disconnect };