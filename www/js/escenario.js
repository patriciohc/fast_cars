
var escenario = {

    game: null, // informacion del juego 
    isMultiplayer: null,

    init: function(isMultiplayer = false) {
        escenario.isMultiplayer = isMultiplayer;
        server.socket.on('infoPlayers', escenario.setInfoPlayers);
        server.socket.on('startGame', escenario.startGame);
    },

    createGame: function(nameGame, noPlayers){

        var setConfigGame = function(request){
            escenario.game = request;
            tools.message("se ha creado juego..");
            escenario.joinGame(escenario.game);
        }
        server.post('/game', {nameGame: nameGame, noPlayers: noPlayers}, setConfigGame);
    },

    joinGame: function(game){
        escenario.game = game;
        player.connect(escenario.game);
    },

    setInfoPlayers: function(data){
        escenario.game.players = data;    
    },

    startGame: function(game){
        escenario.game = game;
        tools.message("jugadores completos");
    }


}