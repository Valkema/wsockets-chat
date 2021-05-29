/*
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const allWss = expressWs.getWss('/');
app.use(express.json());

const messages = [];

app.ws('/', function (ws, req) {
  ws.send(JSON.stringify(messages));
  ws.on('message', function (msg) {
    console.log(msg);

    messages.push(msg);
  
    allWss.clients.forEach(function (client) {
      client.send(JSON.stringify([msg]));
    });
  });
  console.log('socket', req.testing);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
*/


const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const router = require('./router');
app.use(router);

io.on('connection', function (socket) {
  socket.on('test', (data, options) => {
    console.log('data:', data);
    console.log('options:', options);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
