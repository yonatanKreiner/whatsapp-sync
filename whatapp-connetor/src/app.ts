import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();

const wss = new WebSocketServer({ noServer: true });
wss.on('connection', socket => {
  socket.on('message', message => console.log(message));
});

const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});