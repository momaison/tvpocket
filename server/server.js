"use strict";

var app = require("express")();
var server = require("http").createServer(app)
var io = require("socket.io").listen(server);

var ent = require('ent');
var fs = require('fs');

var config = require("serverConfig.json");

var cs = require("services/connectionServices")(io);
var gs = require("services/gameServices")(io);


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {

  /** Authentication **/
  socket.on("signUp", function (newUserInfo) {
    cs.signUp(socket, newUserInfo)
  });

  socket.on("login", function (userInfo) {
    cs.login(socket, userInfo)
  });

  socket.on("disconnect", function (userInfo) {
    cs.disconnect(socket, userInfo)
  });

  socket.on("kick", function (info) {
    cs.kick(socket, info)
  });

  /** Game **/
  socket.on("moving", function (movement) {
    gs.move(socket, movement)
  });

  socket.on("shooting", function (shot) {
    gs.shoot(socket, shot)
  });

  //let's see
  socket.on("upgrading", function (upgrade) {
    gs.upgrade(socket, upgrade)
  });

});

app.use(function(req, res, next){
    res.redirect('/');
});

var serverPort = process.env.PORT || config.port;
server.listen(serverPort, function () {
  console.log("Server online");
});