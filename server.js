// server.js
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import url from 'url';
import { setupWSConnection } from 'y-websocket/bin/utils.js'; // works with v1.4.5

const app = express();
app.get('/health', (req, res) => res.status(200).send('ok'));
app.get('/', (req, res) => res.send('y-websocket wrapped server'));

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});

server.on('upgrade', (request, socket, head) => {
  // optional: check token via query string
  // const parsed = url.parse(request.url, true);
  // const token = parsed.query.token; // validate if needed
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const PORT = Number(process.env.PORT || 1234);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`y-websocket wrapped server listening on ${PORT}`);
});
