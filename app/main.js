var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var data = require('./routes/data');

app.use(express.static('public'));
app.use('/vendor', express.static('bower_components'));
app.use('/data', data);

io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('disconnect', function() {
    console.log('User disconnected');
  });
});

http.listen(3000, function() {
  console.log('Listening on port 3000');
});
