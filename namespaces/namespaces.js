//3rd party module from npm
const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8001);

//default path =  /socket.io
const io = socketio(expressServer);

io.of("/").on("connection", (socket) => {
  socket.join("chat");
  // socket.join("adminChat");
  io.of("/").to("chat").emit("welcomeToChatRoom", {});
  // io.of("/")
  //   .to("chat")
  //   .to("chat2")
  //   .to("adminChat")
  //   .emit("welcomeToChatRoom", {});
  // io.of("/admin").emit("userJoinedMainNS", "");

  // io.on("connection", (socket) => {
  console.log(socket.id, "has connected!");
  //in ws, we use send method and in socket.io we use emit method
  socket.emit("messageFromServer", { data: "Welcome to the socket server!" });

  //socket.on([eventName], [listener])
  socket.on("newMessageToServer", (dataFromClient) => {
    console.log("Data", dataFromClient);

    //send out all the socket with that msg
    io.of("/").emit("newMessageToClient", { text: dataFromClient.text });
    // io.emit("newMessageToClient", { text: dataFromClient.text });
  });
});

io.of("/admin").on("connection", (socket) => {
  console.log(socket.id, "has joined /admin");
  // socket.join("chat");
  // io.of("/admin").emit("newMessageToClientFromAdmin", {});
  io.of("/admin").to("chat").emit("welcomeToChatRoom", {});
});
