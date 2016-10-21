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

    res.send(games);
});

app.post('/game', function(req, res){
    console.log('juegador a creado nuevo juego...');
    var game = {
        id: NO_GAMES,
        nameGame: req.body.nameGame,
        noPlayers: 0, // numero de jugadores actuales
        players: initPlayers(req.body.noPlayers), // numero de jugadores para el juego
        status: 'waiting', // puede tomar los siguientes valores: running, waiting, finished 
    }
    GAMES.push(game);
    NO_GAMES += 1;
    res.send(game);
});

io.on("connection", function(socket){

    // jugador se unira a una partida
    socket.on('joinPlayerInGame', function(game){
        console.log(GAMES[game.id].players.length + " - " + GAMES[game.id].noPlayers);
        if (GAMES[game.id].players.length >= GAMES[game.id].noPlayers + 1 ){
            socket.join(game.nameGame);
            socket.emit("setID", GAMES[game.id].noPlayers);

            if (GAMES[game.id].players.length == GAMES[game.id].noPlayers + 1 ){
                GAMES[game.id].status = 'running';
                io.to(game.nameGame).emit('startGame', GAMES[game.id]);               
            } else {
                GAMES[game.id].noPlayers += 1;
            }

        } else {
            console.log('');
        }
    });

    socket.on('infoPlayer', function(req){
        GAMES[req.idGame].players[req.idPlayer] = req.info;
        io.to(req.nameGame).emit('infoPlayers', GAMES[req.idGame].players);
    });

    
});


// var timer = setInterval(function(){
//     var gamesRuninng; 
//     for (var i in gamesRuninng){
//         var game = gamesRuninng[i];
//         io.to(game.nameGame).emit(game.players);
//         game.players.fill(null);
//     } 
//     //io.sockets.emit("positions", PLAYERS);
//     //PLAYERS = [null, null, null, null];
// }, 50);



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
        point: {x:0, y:0},
        velocityX: 0,
        velocityY: 0,
    }
}