var events = require ('events');
var net = require ('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

// listener on 'join' event, whch trigged when connection from client
channel.on('join', function(id, client) {
  this.clients[id] = client;
  // regist the subscriber function
  this.subscriptions[id] = function(senderId, message) {
    if (id != senderId) {
      // send to the subscriber
      this.clients[id].write(message);
    }
  };
  // add listener on 'braodcast event', then call registed subscriber function
  this.on('braodcast', this.subscriptions[id]);
});

var server = net.createServer(function(client) {
  var id = client.remoteAddress + ":" + client.remotePort;
  console.log("reqest from client id " + id);

  // connection already established then emit 'join' event
  channel.emit('join', id, client);

  client.on('data', function(data) {
    console.log("data received and trigger broadcast " + data.toString());
    data = data.toString();
    channel.emit('braodcast', id, data);
  })
});

server.listen(8888);
console.log("server listening on 8888");
