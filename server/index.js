'use strict';

const express = require('express');
const bodyParser = require('body-parser');
//const methodOverride = require("method-override");

const app = express();
//app.use(methodOverride());
// websockets
var server = require("http").Server(app);
var io = require("socket.io")(server);
require('./controllerWs')(io);

const api = require('./routers');

app.use(express.static("www"));
// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', api);

server.listen('8080', () =>{
    console.log("servidor corriendo en http://localhost:8080");
});
