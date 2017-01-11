"use strict";

const models = require('./models');

// funciones User
function getUsers(req, res){
    models.User.findAll({}).then(function(users){
        return res.status(200).send(users);
    });
}

function getUser(req, res){

}

function createUSer(req, res) {
    var userName = req.body.userName;
    var isGuest = req.body.isGuest;

    models.User.create({ userName: userName, isGuest: isGuest}).then(function(user){
        return res.status(200).send(user);
    });
}
// sale player de juego
function exitUser(req, res) {
    var idGame = req.body.idGame;
    var idPlayer = req.body.idPlayer;

/*    models.User.findOne({
        id: idPlayer
    }).then(function(user){
        if (user.isGuest){
            models.User.destroy({where: {}})
        }
    });

    var game = LINQ.from(GAMES)
        .where(function(x){ return x.id == idGame } )
        .select(function(x){ return x}).toArray()[0];

    for (var i = 0; i < game.players.length; i++){
        if (game.players[i].id = idPlayer){
            game.players[i]
        }
    }
*/
}

// funciones Game
function getGames(req, res){
    models.Game.findAll({
        where: { status: 'waiting'}
    })
    .then(function(games){
        return res.status(200).send(games);
    });


}

function createGame(req, res) {
    var game = {
        nameGame: req.body.nameGame,
        noPlayers: req.body.noPlayers, // numero de jugadores actuales
        status: 'waiting', // puede tomar los siguientes valores: running, waiting, finished
    }

    models.Game.create(game).then(function(game){
        return res.status(200).send(game);
    });
}

function addPlayerToGame(req, res) {
    var idGame = req.body.idGame;
    var idPlayer = req.body.idPlayer;
    models.Game.findById(idGame).then(function(game){
        game.players.push({id:idPlayer});
        game.save();
    });
}

module.exports = {
    //user
    getUsers,
    getUser,
    createUSer,
    exitUser,
    // game
    getGames,
    createGame
}
