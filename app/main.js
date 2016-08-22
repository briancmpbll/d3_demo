var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use('/vendor', express.static('bower_components'));

io.on('connection', (socket)=> {
  console.log('A user connected');

  socket.on('disconnect', function() {
    console.log('User disconnected');
  });
});

http.listen(3000, ()=> {
  console.log('Listening on port 3000');
});
