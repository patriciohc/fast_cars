

var player = {

    MAX_VELOCITY: 5,
    _velocity: 0,
    _factorVelocity_X: 0,
    _factorVelocity_Y: 0,

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
            player.auto.setVelocityY(-1 * player._velocity * player._factorVelocity_Y);
        }
    },
    // decrementa velocidad
    decVelocity: function(){
        if (player._velocity >= 0){
            player._velocity -= 1;
            player.auto.setVelocityY(-1 * player._velocity * player._factorVelocity_Y);
        }
    },

    moveLeft: function(){
        player.auto.setVelocityX(-player._factorVelocity_X);
    },

    moveRight: function(){
        player.auto.setVelocityX(player._factorVelocity_X);
    },

    xNotMove: function(){
        player.auto.setVelocityX(0);
    },

    setFactorVelocity(x, y){
        player._factorVelocity_X = x;
        player._factorVelocity_Y = y;
    },

    connect: function(onFinish) {
        server.socket.emit("joinPlayerInGame", escenario.game);
        server.socket.on("setID", function(idAuto){
            player.init(idAuto);
            if (onFinish)
                onFinish();
            else
                console.log("se ha unido al juego correctamente..."); 
        });
    },


/******************--auto--**********************/

    auto: {

        id: null,
        info: {
            point: {x:0, y:0},
            velocityX: 0,
            velocityY: 0,
        },

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
            player.auto.info.velocityX = x;
            //escenario.game.players[player.auto.id].velocityX = x;
            if (escenario.isMultiplayer)
                player.auto._sendMove();
        },

        setVelocityY: function(y){
            player.auto.info.velocityY = y;
            //escenario.game.players[player.auto.id].velocityY = y;
            if (escenario.isMultiplayer)
                player.auto._sendMove();
        },

        _sendMove: function(){
            var data = {
                idGame: escenario.game.id,
                idPlayer: player.auto.id,
                //info: escenario.game.players[player.auto.id],
                info: player.auto.info,
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