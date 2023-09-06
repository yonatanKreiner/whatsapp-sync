import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { connectToWhatsApp } from './connector';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const app = express();

const socketMap: { [key: string]: any } = {};

const wss = new WebSocketServer({ noServer: true });
wss.on('connection', async socket => {
  const sessionID = uuidv4();
  const clientSocket: WebSocket = socket;
  const whatsappSocketConn = await connectToWhatsApp(clientSocket, sessionID);
  socketMap[sessionID] = { whatsappSocketConn: whatsappSocketConn, clientSocket, isClientCloseConnection: false };

  clientSocket.send("connection to ofir's server happaned");

  clientSocket.on('message', message => console.log(message));
  clientSocket.on('close', async (code, reason) => {
    console.log('client close the connection!')
    socketMap[sessionID].isClientCloseConnection = true;
  });
});

const server = app.listen(5000);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

setInterval(() => {
  if (Object.entries(socketMap)) {
    Object.entries(socketMap).forEach(([key, value]) => {
      if (value.isClientCloseConnection) {
        removeSessionFolderFromStore(key);
      }
    });
  }
}, 3600000)

const removeSessionFolderFromStore = (sessionId: string) => {
  fs.rm(`./sessions/${sessionId}`, { recursive: true }, (err) => {
    if (!err) {
      delete socketMap[sessionId];
    } else {
      console.log(err);
    }
  });
}