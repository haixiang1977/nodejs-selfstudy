var EventEmitter = require('events').EventEmitter;
var channel = new EventEmitter();

// listening join event
channel.on('join', function() {
  console.log('Welcome');
});

// emit join event
channel.emit('join');
