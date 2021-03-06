#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function;
import sys;
sys.dont_write_bytecode = True;

import os;
import base64;
import time;
import json;
import uuid;
import traceback;

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket;
from whatsapp import WhatsAppWebClient;
from utilities import *;
from db import log;

reload(sys);
sys.setdefaultencoding("utf-8");



def eprint(*args, **kwargs):			# from https://stackoverflow.com/a/14981125
	print(*args, file=sys.stderr, **kwargs);



class WhatsAppWeb(WebSocket):
	clientInstances = {};

	def sendJSON(self, obj, tag=None):
		if "from" not in obj:
			obj["from"] = "backend";
		if tag is None:
			tag = str(getTimestampMs());
		self.sendMessage(tag + "," + json.dumps(obj));
	
	def nop(self, obj, tag=None):
		pass;

	def sendError(self, reason, tag=None):
		log(2, "an error has occured", reason);
		self.sendJSON({ "type": "error", "reason": reason }, tag);

	def handleMessage(self):
		try:
			tag = self.data.split(",", 1)[0];
			obj = json.loads(self.data[len(tag)+1:]);

			if "from" not in obj or obj["from"] != "api2backend" or "type" not in obj or not (("command" in obj and obj["command"] == "backend-connectWhatsApp") or "whatsapp_instance_id" in obj):
				self.sendError("Invalid request");
				return;

			if obj["type"] == "call":
				if "command" not in obj:
					self.sendError("Invalid request");
					return;

				if obj["command"] == "backend-connectWhatsApp":
					clientInstanceId = uuid.uuid4().hex;
					onOpenCallback = {
						"func": lambda cbSelf: self.sendJSON(mergeDicts({ "type": "resource_connected", "resource": "whatsapp" }, getAttr(cbSelf, "args")), getAttr(cbSelf, "tag")),
						"tag": tag,
						"args": { "resource_instance_id": clientInstanceId }
					};
					onMessageCallback = {
						"func": lambda obj, cbSelf, moreArgs=None: self.nop(obj),
						"args": { "resource_instance_id": clientInstanceId }
					};
					onCloseCallback = {
						"func": lambda cbSelf: self.sendJSON(mergeDicts({ "type": "resource_gone", "resource": "whatsapp" }, getAttr(cbSelf, "args")), getAttr(cbSelf, "tag")),
						"args": { "resource_instance_id": clientInstanceId }
					};
					self.clientInstances[clientInstanceId] = WhatsAppWebClient(onOpenCallback, onMessageCallback, onCloseCallback);
				else:
					currWhatsAppInstance = self.clientInstances[obj["whatsapp_instance_id"]];
					callback = {
						"func": lambda obj, cbSelf: self.sendJSON(mergeDicts(obj, getAttr(cbSelf, "args")), getAttr(cbSelf, "tag")),
						"tag": tag,
						"args": { "resource_instance_id": obj["whatsapp_instance_id"] }
					};
					if currWhatsAppInstance.activeWs is None:
						self.sendError("No WhatsApp server connected to backend.");
						return;

					cmd = obj["command"];
					if cmd == "backend-generateQRCode":
						currWhatsAppInstance.generateQRCode(callback);
					elif cmd == "backend-regenerateQRCode":
						currWhatsAppInstance.regenerateQRCode(callback);
					elif cmd == "backend-getPhoto":
						currWhatsAppInstance.getPhoto(obj["phone"], callback);
					elif cmd == "backend-getLoginInfo":
						currWhatsAppInstance.getLoginInfo(callback);
					elif cmd == "backend-getConnectionInfo":
						currWhatsAppInstance.getConnectionInfo(callback);
					elif cmd == "backend-disconnectWhatsApp":
						currWhatsAppInstance.disconnect();
						self.sendJSON({ "type": "resource_disconnected", "resource": "whatsapp", "resource_instance_id": obj["whatsapp_instance_id"] }, tag);
		except:
			log(2, 'an error while processing message', traceback.format_exc());

	def handleConnected(self):
		self.sendJSON({ "from": "backend", "type": "connected" });
		log(3, self.address + " connected to backend");

	def handleClose(self):
		whatsapp.disconnect();
		log(3, self.address + " closed connection to backend");

port = os.environ.get('PORT') or 2020;
server = SimpleWebSocketServer("", int(port), WhatsAppWeb);
eprint("whatsapp-photo-sync backend listening on port " + str(port));
server.serveforever();
