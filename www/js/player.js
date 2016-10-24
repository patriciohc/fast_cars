

var player = {

    MAX_VELOCITY: 5,
    _velocity: 0,
    _factorVelocity_X: 0,
    _factorVelocity_Y: 0,

    init: function(){
        player.auto.init();
    },

    resetVelocity: function(){
        player._velocity = 0;
        player.auto.setVelocityY(0);
    },
    // incrementa velocidad
    incVelocity: function(){
        if (player._velocity != "disabled" && player._velocity < player.MAX_VELOCITY){
            player._velocity += 1;
            player.auto.setVelocityY(-1 * player._velocity * player._factorVelocity_Y);
        }
    },
    // decrementa velocidad
    decVelocity: function(){
        if (player._velocity != "disabled" && player._velocity >= 0){
            player._velocity -= 1;
            player.auto.setVelocityY(-1 * player._velocity * player._factorVelocity_Y);
        }
    },
    // movimiento izquierda
    moveLeft: function(){
        player.auto.setVelocityX(-player._factorVelocity_X);
    },
    // movimiento derecha
    moveRight: function(){
        player.auto.setVelocityX(player._factorVelocity_X);
    },
    // detine movimiento en x
    xNotMove: function(){
        player.auto.setVelocityX(0);
    },
    // establece el factor de felcidad, variable para cada dispositivo
    setFactorVelocity: function(x, y){
        player._factorVelocity_X = x;
        player._factorVelocity_Y = y;
    },

    disabledVelocity: function(){
        player._velocity = "disabled";
    },
    // se une al juego establecido en escenario.game, y obitiene el id para esta jugador
    connect: function(onFinish) {
        var data = {
            idGame: escenario.game.id,
            nameGame: escenario.game.nameGame,
            idPlayer: player.auto.id,
        }
        server.socket.emit("joinPlayerInGame", data);
        // server.socket.on("setID", function(idAuto){
        //     player.init(idAuto);
        //     if (onFinish)
        //         onFinish();
        //     else
        //         console.log("se ha unido al juego correctamente su id es: " + idAuto); 
        // });
    },


/******************--auto--**********************/

    auto: {

        id: null,
        info: {
            point: {x:0, y:0},
            velocityX: 0,
            velocityY: 0,
        },

        init: function(){
            player.auto.id = "player_" + Math.round(Math.random() * 10000); // este dato es temporal, vendra de la interfaz
        },

        getVelocityX: function(){
            return escenario.game.players.find(function(element){
                if (element.id == auto.id)
                    return true;
                else 
                    return false;
            }).velocityX;
            //return escenario.game.players[player.auto.id].velocityX;
        },

        getVelocityY: function(){
            return escenario.game.players.find(function(element){
                if (element.id == auto.id)
                    return true;
                else 
                    return false;
            }).velocityY;
            //return escenario.game.players[player.auto.id].velocityY;
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