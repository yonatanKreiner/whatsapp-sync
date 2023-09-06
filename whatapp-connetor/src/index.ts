import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { connectToWhatsApp } from './connector';
import { v4 as uuidv4 } from 'uuid';

const app = express();

const socketMap = {};

const wss = new WebSocketServer({ noServer: true });
wss.on('connection', async socket => {
  const sessionID = uuidv4();
  const clientSocket: WebSocket = socket;
  const whatsappSocketConn = await connectToWhatsApp(clientSocket, sessionID);
  socketMap[sessionID] = { whatsappSocketConn: whatsappSocketConn, clientSocket };

  socket.send("connection to ofir's server happaned");
  
  socket.on('message', message => console.log(message));
});

const server = app.listen(5000);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});