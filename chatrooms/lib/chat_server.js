var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = [];
var namesUsed = [];
var currentRoom = [];

exports.listen = function(server) {
  io = socketio.listen(server);
  io.set('log level', 1);
  console.log("Chat Server start to listen");
  io.sockets.on('connection', function(socket) {
    console.log("Chat Server connection accepted");
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    joinRoom(socket, 'Lobby');

    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);

    socket.on('room', function() {
      socket.emit('room', io.socket.manager.rooms);
    });

    handleClientDisconnection(socket, nickNames, namesUsed);
  });
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  console.log("assignGuestName called");
  var name = 'Guest' + guestNumber;
  nickNames[socket.id] = name;
  console.log("emit nameResult called name ", name);
  socket.emit('nameResult', {
    success: true,
    name: name
  });
  namesUsed.push(name);
  return guestNumber + 1;
};

function joinRoom(socket, room) {
  console.log("joinRoom called");
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit('joinResult', {room: room});
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + ' . '
  });

  var usersInRoom = io.sockets.clients(room);
  if (usersInRoom.length > 1) {
    var usersInRoomSummary = 'Users currently in ' + room + ': ';
    for (var index in usersInRoom) {
      var userSocketId = usersInRoom[index].id;
      if (userSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    socket.emit('message', {text: usersInRoomSummary});
  }
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  console.log("handleNameChangeAttempts called");
  socket.on('nameAttempt', function(name){
    if (name.indexOf('Guest') == 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names can not begin with "Guest".'
      });
    } else {
      if (namesUsed.indexOf(name) == -1) {
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];
        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + '.'
        });
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        });
      }
    }
  });
}

function handleMessageBroadcasting(socket) {
  console.log("handleMessageBroadcasting called");
  socket.on('message', function(message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.txt
    });
  });
};

function handleRoomJoining(socket) {
  console.log("handleRoomJoining called");
  socket.on('join', function(room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket,room.newRoom);
  });
};

function handleClientDisconnection(socket) {
  console.log("handleClientDisconnection called");
  socket.on('disconnect', function(){
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
};
