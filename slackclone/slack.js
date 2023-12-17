//3rd party module from npm
const express = require("express");
const app = express();
const socketio = require("socket.io");

const namesapces = require("./data/namespaces");
const Room = require("./classes/Room");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000); //handle http traffic
const io = socketio(expressServer); //handle websocket or tcp traffic

// app.set("io", io);

//manufactured way to change the ns
app.get("/change-ns", (req, res) => {
  //update the ns array
  namesapces[0].addRoom(new Room(0, "Deleted Articles", 0));
  //let everyone know in this namespace that it changed!
  io.of(namesapces[0].endpoint).emit("nsChange", namesapces[0]); //socket-io
  res.json(namesapces[0]);
});

io.on("connection", (socket) => {
  // const userName = socket.handshake.query.userName;

  socket.emit("welcome", "Welcome to the Server!");
  socket.on("clientConnect", (data) => {
    console.log(socket.id, "has connected!");
    socket.emit("nsList", namesapces);
  });
});

namesapces.forEach((namesapce) => {
  io.of(namesapce.endpoint).on("connection", (socket) => {
    // console.log(`${socket.id} has connected to ${namesapce.endpoint}`);
    socket.on("joinRoom", async (roomObj, ackCallBack) => {
      //log the history
      // const thisNs = namesapces[roomObj.namesapceId];
      // const thisRoomObj = thisNs.rooms.find(
      //   (room) => room.roomTitle === roomObj.roomTitle
      // );
      // const thisRoomsHistory = thisRoomObj.history;

      //leave all the room(except own room) because the client can be in only one room
      const rooms = socket.rooms;
      // console.log(rooms);
      let i = 0;
      rooms.forEach((room) => {
        //we dont want to leav the sockets 1st room,
        if (i !== 0) {
          socket.leave(room);
        }
        i++;
      });

      //join the room
      //NOTE - room title is coming from client, which is NOT SAFE!
      //Auth to make sure the socket has right to be in that room
      socket.join(roomObj.roomTitle);

      //Fetch the no of sockets in this room
      const sockets = await io
        .of(namesapce.endpoint)
        .in(roomObj.roomTitle)
        .fetchSockets();
      const socketCount = sockets.length;

      ackCallBack({
        numUsers: socketCount,
        // thisRoomsHistory,
      });
    });

    socket.on("newMessageToRoom", (messageObj) => {
      console.log(messageObj);
      //broadcast this to all the connected clients... this room only!
      //how can we find out what room This socket is in
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1]; //this is a set, not an Array! ... will convert set into an Array

      //send this message object to everyone including the sender
      io.of(namesapce.endpoint)
        .in(currentRoom)
        .emit("messageToRoom", messageObj);

      //add this message to this room's history
      const thisNs = namesapces[messageObj.selectedNsId];
      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === currentRoom
      );
      thisRoom.addMsg(messageObj);
    });
  });
});
