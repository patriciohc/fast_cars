
var escenario = {

    game: null, // informacion del juego
    carsNoPlayers: null,
    obstaculos: null,
    isMultiplayer: null,

    init: function(isMultiplayer = false) {
        escenario.isMultiplayer = isMultiplayer;
        server.socket.on('setEscenario', escenario.setEscenario);
        server.socket.on('infoPlayers', escenario.setInfoPlayers);
    },
    // nameGame: nombre del juego
    // noPlayers: numero de jugadores
    // onFinish: funsion que se ejecuta cuando se ha creado el juego 
    createGame: function(nameGame, noPlayers, onFinish){

        var setConfigGame = function(request){
            escenario.game = request;
            if (onFinish)
                onFinish();
            else
                console.log("se ha creado un nuevo juego..."); 
        }
        server.post('/game', {nameGame: nameGame, noPlayers: noPlayers}, setConfigGame);
    },

    setGame: function(game){
        escenario.game = game;
    },

    setInfoPlayers: function(data){
        escenario.game.players = data;    
    },

    setEscenario: function(data){
        escenario.carsNoPlayers = data.carsNoPlayers;
        escenario.obstaculos = data.obstaculos;
        escenario.roadLength = data.roadLength;
    },

}