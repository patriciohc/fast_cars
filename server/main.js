var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require("method-override");
//var mongoose = require('mongoose');
var LINQ = require('linq');  


var app = express();
// Middlewares
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
app.use(methodOverride());

var router = express.Router();

app.use(router);

var server = require("http").Server(app);

app.use(express.static("www"));

var io = require("socket.io")(server);

var NO_GAMES = 0;
var GAMES = [];

app.get('/game', function(req, res){
    var games = LINQ.from(GAMES)
        .where(function(x){ return x.status == 'waiting'} )
        .select(function(x){ return x}).toArray();
    console.log("GET /game");
    return res.status(200).send(games);
});

app.post('/game', function(req, res){
    console.log('jugador a creado nuevo juego: ' + req.body.nameGame);
    var game = {
        id: NO_GAMES,
        nameGame: req.body.nameGame,
        noPlayers: 0, // numero de jugadores actuales
        players: initPlayers(req.body.noPlayers), // numero de jugadores para el juego
        status: 'waiting', // puede tomar los siguientes valores: running, waiting, finished 
    }
    GAMES.push(game);
    NO_GAMES += 1;
    return res.status(200).send(game);
});

io.on("connection", function(socket){

    // jugador se unira a una partida
    socket.on('joinPlayerInGame', function(req) {
        if (GAMES[req.idGame].players.length >= GAMES[req.idGame].noPlayers + 1 ){
            socket.join(req.nameGame);
            GAMES[req.idGame].players[GAMES[req.idGame].noPlayers].id = req.idPlayer;

            if (GAMES[req.idGame].players.length == GAMES[req.idGame].noPlayers + 1 ){

                var roadLength = 50000;

                var data = {
                    carsNoPlayers: getObstaculos(20, 80, 200, 1000, roadLength+100),
                    obstaculos: getObstaculos(20, 80, 200, 1000, roadLength+100),
                    roadLength: roadLength,
                };

                io.to(req.nameGame).emit('setEscenario', data);           
                GAMES[req.idGame].status = 'running';
                io.to(req.nameGame).emit('startGame', GAMES[req.idGame]);               
            } else {
                GAMES[req.idGame].noPlayers += 1;
            }

        } else {
            console.log('');
        }
    });

    socket.on('infoPlayer', function(req){
        //GAMES[req.idGame].players[req.idPlayer] = req.info;
        GAMES[req.idGame].players.find(function(item){
            if (item.id == req.idPlayer)
                return true;
            else 
                return false;
        }).info = req.info;
        io.to(req.nameGame).emit('infoPlayers', GAMES[req.idGame].players);
    });


    socket.on('onWin', function(req){
        io.to(req.nameGame).emit('onWin', req.player);
    });

    
});



server.listen(8080, function(){
     console.log("servidor corriendo en http://localhost:8080");
});

function initPlayers(n){
    var players = []
    for (var i = 0; i < n; i++){
        players.push(getConfigAuto());
    }
    return players;
}

function getConfigAuto(){
    return {
        id: null,
        info: {
            point: {x:0, y:0},
            velocityX: 0,
            velocityY: 0,
        }
    }
}


function getObstaculos (nObstaculos, minX, maxX, minY, maxY){
    var obstaculos = [];
    for (var i = 0; i < nObstaculos; i++) {
        var element = {};
        element.x = Math.floor((Math.random() * maxX) + minX);
        element.y = Math.floor((Math.random() * maxY) + minY); 
        element.v = -Math.floor((Math.random() * 400) + 50); // velocidad
        element.t = Math.ceil(Math.random() * 3); // tipo de carro
        obstaculos.push( element );
    }
    return obstaculos;
}