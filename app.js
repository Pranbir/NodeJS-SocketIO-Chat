var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(80, function(){
   console.log("Server is running on port 80"); 
});

app.use("/", express.static("./public"));
var io = socket(server);

io.on('connection', function(socket){
    console.log('a user connected, id : ',socket.id);
  
      socket.on('disconnect', function(){
          console.log('user disconnected. id :',socket.id," , InstaId :",socket.instaId);
          let disUserName = socket.instaId;
          io.sockets.emit("userLeft", {name : disUserName});
      });

      socket.on('userAdded', function(data){
        io.sockets.emit("userAdded", data);
        socket.instaId = data.name;
      });
      
      socket.on('msg', function(data){
          let socketId = socket.id;
          data.socketId = socketId;
         socket.broadcast.emit("msg", data);
      });
      socket.on('pm', function(data){
          let socketId = socket.id;
          data.socketId = socketId;
         socket.to(data.toSocketId).emit("pm", data);
      });
  });