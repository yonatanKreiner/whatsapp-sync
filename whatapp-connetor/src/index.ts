import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { connectToWhatsApp } from './connector';
import makeWASocket,
{
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  initAuthCreds,
  makeInMemoryStore,
  WAMessageKey,
  WAMessageContent
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";

const app = express();

const socketMap = {};

const wss = new WebSocketServer({ noServer: true });
wss.on('connection', async socket => {
  const clientSocket: WebSocket = socket;
  const whatsappSocketConn = await connectToWhatsApp(clientSocket);
  socketMap["some-id"] = { whatsappSocketConn: whatsappSocketConn, clientSocket };

  socket.send("connection to ofir's server happaned");
  
  socket.on('message', message => console.log(message));
});

const server = app.listen(5000);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});