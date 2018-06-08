let _ = require("lodash");
let fs = require("fs");
let path = require("path");
let {StringDecoder} = require("string_decoder");
let express = require("express");
let WebSocket = require("ws");

let {WebSocketClient} = require("./client/js/WebSocketClient.js");
let {BootstrapStep}   = require("./client/js/BootstrapStep.js");

let server = express()
	.use(express.static("client"))
	.listen(2018, function() {
		console.log("whatsapp-web-reveng HTTP server listening on port 2018");
	});


let wss = new WebSocket.Server({ server });

let backendInfo = {
	url: "ws://localhost:2020",
	timeout: 10000
};

wss.on("connection", function(clientWebsocketRaw, req) {
	let backendWebsocket = new WebSocketClient();
	let clientWebsocket = new WebSocketClient().initializeFromRaw(clientWebsocketRaw, "api2client", {getOnMessageData: msg => new StringDecoder("utf-8").write(msg.data)});
	clientWebsocket.send({ type: "connected" });
	//clientWebsocket.onClose(() => backendWebsocket.disconnect());

	clientWebsocket.waitForMessage({
		condition: obj => obj.from == "client"  &&  obj.type == "call"  &&  obj.command == "api-connectBackend",
		keepWhenHit: true
	}).then(clientCallRequest => {
		if(backendWebsocket.isOpen)
			return;
		new BootstrapStep({
			websocket: backendWebsocket,
			actor: websocket => {
				websocket.initialize(backendInfo.url, "api2backend", {func: WebSocket, args: [{ perMessageDeflate: false }], getOnMessageData: msg => new StringDecoder("utf-8").write(msg.data)});
				websocket.onClose(() => {
					clientWebsocket.send({ type: "resource_gone", resource: "backend" });
				});
			},
			request: {
				type: "waitForMessage",
				condition: obj => obj.from == "backend"  &&  obj.type == "connected"
			}
		}).run(backendInfo.timeout).then(backendResponse => {
			clientCallRequest.respond({ type: "resource_connected", resource: "backend" });
		}).catch(reason => {
			clientCallRequest.respond({ type: "error", reason: reason });
		});
	}).run();

	clientWebsocket.waitForMessage({
		condition: obj => obj.from == "client"  &&  obj.type == "call"  &&  obj.command == "backend-connectWhatsApp",
		keepWhenHit: true
	}).then(clientCallRequest => {
		if(!backendWebsocket.isOpen) {
			clientCallRequest.respond({ type: "error", reason: "No backend connected." });
			return;
		}
		new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-connectWhatsApp" },
				successCondition: obj => obj.type == "resource_connected"  &&  obj.resource == "whatsapp"  &&  obj.resource_instance_id
			}
		}).run(backendInfo.timeout).then(backendResponse => {
			backendWebsocket.activeWhatsAppInstanceId = backendResponse.data.resource_instance_id;
			backendWebsocket.waitForMessage({
				condition: obj => obj.type == "resource_gone"  &&  obj.resource == "whatsapp",
				keepWhenHit: false
			}).then(() => {
				delete backendWebsocket.activeWhatsAppInstanceId;
				clientWebsocket.send({ type: "resource_gone", resource: "whatsapp" });
			});
			clientCallRequest.respond({ type: "resource_connected", resource: "whatsapp" });
		}).catch(reason => {
			clientCallRequest.respond({ type: "error", reason: reason });
		});
	}).run();

	clientWebsocket.waitForMessage({
		condition: obj => obj.from == "client"  &&  obj.type == "call"  &&  obj.command == "backend-disconnectWhatsApp",
		keepWhenHit: true
	}).then(clientCallRequest => {
		if(!backendWebsocket.isOpen) {
			clientCallRequest.respond({ type: "error", reason: "No backend connected." });
			return;
		}
		new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-disconnectWhatsApp", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
				successCondition: obj => obj.type == "resource_disconnected"  &&  obj.resource == "whatsapp"  &&  obj.resource_instance_id == backendWebsocket.activeWhatsAppInstanceId
			}
		}).run(backendInfo.timeout).then(backendResponse => {
			clientCallRequest.respond({ type: "resource_disconnected", resource: "whatsapp" });
		}).catch(reason => {
			clientCallRequest.respond({ type: "error", reason: reason });
		});
	}).run();

	clientWebsocket.waitForMessage({
		condition: obj => obj.from == "client"  &&  obj.type == "call"  &&  obj.command == "backend-generateQRCode",
		keepWhenHit: true
	}).then(clientCallRequest => {
		if(!backendWebsocket.isOpen) {
			clientCallRequest.respond({ type: "error", reason: "No backend connected." });
			return;
		}
		new BootstrapStep({
			websocket: backendWebsocket,
			request: {
				type: "call",
				callArgs: { command: "backend-generateQRCode", whatsapp_instance_id: backendWebsocket.activeWhatsAppInstanceId },
				successCondition: obj => obj.from == "backend"  &&  obj.type == "generated_qr_code"  &&  obj.image  &&  obj.content
			}
		}).run(backendInfo.timeout).then(backendResponse => {
			clientCallRequest.respond({ type: "generated_qr_code", image: backendResponse.data.image })
		}).catch(reason => {
			clientCallRequest.respond({ type: "error", reason: reason });
		})
	}).run();
});
