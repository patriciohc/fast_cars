'use strict'

const models = require('./models');

var io;

function joinPlayerInGame(socket){
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
        console.log("Numbers players " + game.users.length);
        var noPlayersAct = game.user.length; // numero de jugadores actuales
        var noPlayers = game.players; // numero de jugadores permitidos
        if (noPlayersAct >= noPlayers){
            socket.join(game.nameGame);
            if (noPlayersAct == noPlayers){
                var data = {
                    carsNoPlayers: getObstaculos(20, 80, 200, 1000, roadLength+100), // autos que no jugan
                    obstaculos: getObstaculos(20, 80, 200, 1000, roadLength+100), // obstaculos
                    roadLength: 50000, // tamño de la carretera
                };
                io.to(game.nameGame).emit('setEscenario', data);
                var ids = game.user.map(item => {
                    return item.id;
                });
                var dataPlayers = initPlayers(ids);
                game.status = 'running';
                io.to(game.nameGame).emit('startGame', dataPlayers);
            }
        }
        //if ()
        //return res.status(200).send(games);
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

function infoPlayer(req) {
        //console.log("web sockec conectado...");
        var idGame = req.
        //GAMES[req.idGame].players[req.idPlayer] = req.info;
        /*GAMES[req.idGame].players.find(function(item){
            if (item.id == req.idPlayer)
                return true;
            else
                return false;
        }).info = req.info;
        io.to(req.nameGame).emit('infoPlayers', GAMES[req.idGame].players);*/
}

function onWin(req){
    io.to(req.nameGame).emit('onWin', req.player);
}

function connect(ws) {
    console.log("web sockec conectado...");
        // jugador se unira a una partida
    ws.on('joinPlayerInGame', joinPlayerInGame);

    ws.on('infoPlayer', infoPlayer);

    ws.on('onWin', onWin);
}

module.exports = function(sockeIO){
    io = sockeIO;
    io.on("connection", connect);
}


function initPlayers(ids){

    var getConfigAuto = function (id) {
        return {
            id: id,
            info: {
                point: {x:0, y:0},
                velocityX: 0,
                velocityY: 0,
            }
        }
    }

    var players = []
    for (var i = 0; i < ids.lenght; i++) {
        players.push(getConfigAuto(ids[i]));
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
