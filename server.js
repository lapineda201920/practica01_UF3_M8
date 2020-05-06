const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();

const http = require('htpp');
const server = http.Server(app);

app.use(express.static('client'));

server.listen(PORT, function(){
  console.log("El xat funciona")
});

const io = require('socket.io')(server);

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})