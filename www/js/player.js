

var player = {

    MAX_VELOCITY: 4,
    _velocity: 0,
    _pasoVelocity: 200,

    init: function(idAuto = 0){
        player.auto.init(idAuto);
    },

    resetVelocity: function(){
        player._velocity = 0;
        player.auto.setVelocityY(0);

    },
    // incrementa velocidad
    incVelocity: function(){
        if (player._velocity < player.MAX_VELOCITY){
            player._velocity += 1;
            player.auto.setVelocityY(-1 * player._velocity * player._pasoVelocity);
        }
    },
    // decrementa velocidad
    decVelocity: function(){
        if (player._velocity >= 0){
            player._velocity -= 1;
            player.auto.setVelocityY(-1 * player._velocity * player._pasoVelocity);
        }
    },

    connect: function(game) {
        
        server.socket.emit("joinPlayerInGame", game);
        server.socket.on("setID", function(idAuto){
            player.init(idAuto);
            tools.message("se ha unido al juego correctamente...");
        });
    },


/******************--auto--**********************/

    auto: {

        id: null,

        init: function(idAuto = 0){
            player.auto.id = idAuto;
        },

        getVelocityX: function(){
            return escenario.game.players[player.auto.id].velocityX;
        },

        getVelocityY: function(){
            return escenario.game.players[player.auto.id].velocityY;
        },

        setVelocityX: function(x){
            escenario.game.players[player.auto.id].velocityX = x;
            if (escenario.isMultiplayer)
                player.auto._sendMove();
        },

        setVelocityY: function(y){
            escenario.game.players[player.auto.id].velocityY = y;
            if (escenario.isMultiplayer)
                player.auto._sendMove();
        },

        _sendMove: function(){
            var data = {
                idGame: escenario.game.id,
                idPlayer: player.auto.id,
                info: escenario.game.players[player.auto.id],
                nameGame: escenario.game.nameGame,
            };
            server.socket.emit("infoPlayer", data);
        },

    }, /*******************************************/

}



/*
{
    point: {x:0, y:0};
    velocityX: 0;
    velocityY: 0;
};
*/