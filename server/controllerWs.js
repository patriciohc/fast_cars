'use strict'

const models = require('./models');

function joinPlayerInGame(req){
    var idGame = req.idGame;

    models.Game.findAll({
        where: {id: idGame},
        include: [models.User]
    }).then(function(games) {
        console.log(games);
        return res.status(200).send(games);
    });

    /*if (GAMES[req.idGame].players.length >= GAMES[req.idGame].noPlayers + 1 ){
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
    }*/
}

function infoPlayer(req) {
        console.log("web sockec conectado...");
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

module.exports = {
    connect,
}