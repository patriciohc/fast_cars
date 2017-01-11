'use strict'

const models = require('./models');

var io;
var socket;
var countersReady = {};

function joinPlayerInGame(req){
    var idGame = req.idGame;
    var idPlayer = req.idPlayer;
    models.User.update({gameId: idGame}, {where: {id: idPlayer}})
    .catch(err => {
        console.log("error: "+ error);
    });

    models.Game.findOne({
        where: {id:idGame},
        include: [models.User]
    }).then((game) => {
        //console.log(game);
        if (!game)
            return;
        console.log("Numbers players: " + game.users.length);
        var noPlayersAct = game.users.length; // numero de jugadores actuales
        var noPlayers = game.players; // numero de jugadores permitidos
        if (noPlayersAct >= noPlayers){
            socket.join(game.id);
            if (noPlayersAct == noPlayers) {
                var data = {
                    carsNoPlayers: getObstaculos(20, 80, 200, 1000, roadLength+100), // autos que no jugan
                    obstaculos: getObstaculos(20, 80, 200, 1000, roadLength+100), // obstaculos
                    roadLength: 50000, // tamño de la carretera
                };
                io.to(game.id).emit('setEscenario', data);
                var ids = game.user.map(item => {
                    return item.id;
                });
                var dataPlayers = initPlayers(ids);
                game.status = 'running';
                io.to(game.id).emit('playersComplete', dataPlayers);
            }
        }
    });

    /*if (GAMES[req.idGame].players.length >= GAMES[req.idGame].noPlayers + 1 ){
        socket.join(req.nameGame);
        GAMES[req.idGame].players[GAMES[req.idGame].noPlayers].id = req.idPlayer;

        if (GAMES[req.idGame].players.length == GAMES[req.idGame].noPlayers + 1 ){
            ............
        } else {
            GAMES[req.idGame].noPlayers += 1;
        }

    } else {
        console.log('');
    }*/
}

function playerReady(req) {
    models.Game.findById(req.idGame, function (){
        if (!countersReady[req.idGame]){
            countersReady[req.idGame] = 0;
        } else {
            countersReady[req.idGame] += 1
        }
        if (game.noPlayers == countersReady[req.idGame]) {
            delete countersReady[req.idGame];
            io.to(game.id).emit('startGame', dataPlayers);
        }
    });
}

function infoPlayer(req) {
        //console.log("web sockec conectado...");
        var idGame = req.idGame;
        var data = {
            idPlayer: req.idPlayer,
            info: req.info,
        }
        io.to(idGame).emit('infoPlayers', data);

        //GAMES[req.idGame].players[req.idPlayer] = req.info;
        /*GAMES[req.idGame].players.find(function(item){
            if (item.id == req.idPlayer)
                return true;
            else
                return false;
        }).info = req.info;
        io.to(req.nameGame).emit('infoPlayers', GAMES    models.User.findOne({where:{id:req.idPlayer}, user =>{

    });[req.idGame].players);*/
}

function onWin(req){
    io.to(req.nameGame).emit('onWin', req.player);
}

function cancelJoin(req){
    console.log("salir de juego");
    models.User.update({gameId: null}, {where: {id: idPlayer}})
    .catch(err => {
        console.log("error: "+ err);
    });

    models.Game.findOne({
        where: {id:req.idGame},
        include: [models.User]
    }).then( game => {
        console.log(game);
        if(game.users.lenght == 0){
            game.destroy();
            io.emit('newGame');
            return;
        }
    });
}

function connect(sk) {
    console.log("web sockec conectado...");
    socket = sk;
    // jugador se unira a una partida
    socket.on('joinPlayerInGame', joinPlayerInGame);

    socket.on('playerReady', playerReady);

    socket.on('infoPlayer', infoPlayer);

    socket.on('onWin', onWin);

    socket.on('newGame', () => {io.emit('newGame')});

    socket.on('cancelJoin', cancelJoin);
}

module.exports = function(sockeIO) {
    io = sockeIO;
    io.on("connection", connect);
}


function initPlayers(ids){

    var getConfigAuto = function () {
        return {
            point: {x:0, y:0},
            velocityX: 0,
            velocityY: 0,
        }
    }
    var players = {};
    for (var i = 0; i < ids.lenght; i++) {
        players[ids[i]] = getConfigAuto();
    }
    return players;
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
