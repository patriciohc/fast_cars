
var escenario = {

    game: null, // informacion del juego
    carsNoPlayers: null,
    obstaculos: null,
    isMultiplayer: null,
    players: null,

    init: function(isMultiplayer = false) {
        escenario.isMultiplayer = isMultiplayer;
        server.socket.on('setEscenario', escenario.setEscenario);
        server.socket.on('playersComplete', escenario.setPlayers);
        server.socket.on('setInfoPlayers', escenario.setInfoPlayers);
        server.socket.on('onWin', escenario.onWin);
    },

    setGame: function(game){
        escenario.game = game;
    },

    setPlayers: function(players){
        escenario.players = players;
        server.socket.emit("playerReady", {idPlayer: Player.auto.id, idGame:escenario.game.id});
    },

    setInfoPlayers: function(data){
        escenario.players[data.idPlayer] = data.info;
    },

    setEscenario: function(data){
        escenario.carsNoPlayers = data.carsNoPlayers;
        escenario.obstaculos = data.obstaculos;
        escenario.roadLength = data.roadLength;
    },

    onWin: function(player){
        alert("Jugador ganador: " + player.id);
    }

}
