import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { connectToWhatsApp } from './connector';

const app = express();

const appSockets = {};

const wss = new WebSocketServer({ noServer: true });
wss.on('connection', socket => {
  const clientSocket: WebSocket = socket;
  const whatsappSocket = connectToWhatsApp(clientSocket);
  appSockets["ofirConn"] = {clientSocket, whatsappSocket }

  socket.send("connection to ofir's server happaned");

  socket.on('message', message => console.log(message));
  socket.on('close', (code: number, reason: Buffer) => console.log(code + reason.toString()))
});

const server = app.listen(5000);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});