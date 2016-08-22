const express = require('express');
const app = express();
const data = require('./routes/data');

let http = require('http').Server(app);
let io = require('socket.io')(http);
let database = require('./database');

app.use(express.static('public'));
app.use('/vendor', express.static('bower_components'));
app.use('/data', data);

io.on('connection', socket=> {
  console.log('A user connected');

  socket.on('disconnect', ()=> {
    console.log('A user disconnected');
  });
});

// Create a new data point every 30 seconds.
setInterval(()=> {
  database.addData()
  .then(data=> {
    console.log(`Added new data: ${JSON.stringify(data)}`);
    io.sockets.emit('data', data);
  })
  .catch(err=> {
    console.log(`Error adding new data: ${err}`);
  });
}, 5000);

http.listen(3000, ()=> {
  console.log('Listening on port 3000');
});
