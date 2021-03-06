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
var cors = require('cors');
const app = express();
//const bodyParser = require('body-parser');
//app.use(bodyParser);
app.use(cors());
app.use(express);
const corsOpt = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};



const server = http.Server(app);
//const io = socketIO(server);
const io = socketIO(server, { corsOpt });

const router = require('./router');
const { connect } = require('./router');
const { default: socket } = require('../client/src/api/ws');
app.use(router);

const rooms = ['room1', 'room2'];
const joinToRooms = (socket) => {
  rooms.forEach((room) => {
    socket.join(room);
  });
};

io.on('connection', function connectionHandlerFun(socket) {
  joinToRooms(socket);
  socket.on('message', (room, message) => {
    io.on(room).emit('new-message', room, message);
  });
  socket.on('join-to-room', (room) => {});
});

io.on('disconnect', (reason) => {
  console.log(reason);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));