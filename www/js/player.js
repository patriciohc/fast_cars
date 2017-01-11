

var Player = {

    MAX_VELOCITY: 5,
    _velocity: 0,
    _factorVelocity_X: 0,
    _factorVelocity_Y: 0,

    init: function(player){
        Player.auto.init(player.id);
    },

    resetVelocity: function(){
        Player._velocity = 0;
        Player.auto.setVelocityY(0);
    },
    // incrementa velocidad
    incVelocity: function(){
        if (Player._velocity != "disabled" && Player._velocity < Player.MAX_VELOCITY){
            Player._velocity += 1;
            Player.auto.setVelocityY(-1 * Player._velocity * Player._factorVelocity_Y);
        }
    },
    // decrementa velocidad
    decVelocity: function(){
        if (Player._velocity != "disabled" && Player._velocity >= 0){
            Player._velocity -= 1;
            Player.auto.setVelocityY(-1 * Player._velocity * Player._factorVelocity_Y);
        }
    },
    // movimiento izquierda
    moveLeft: function(){
        Player.auto.setVelocityX(-Player._factorVelocity_X);
    },
    // movimiento derecha
    moveRight: function(){
        Player.auto.setVelocityX(Player._factorVelocity_X);
    },
    // detine movimiento en x
    xNotMove: function(){
        Player.auto.setVelocityX(0);
    },
    // establece el factor de felcidad, variable para cada dispositivo
    setFactorVelocity: function(x, y){
        Player._factorVelocity_X = Math.round(x);
        Player._factorVelocity_Y = Math.round(y);
    },
    // le indica al servidor que este jugador ha ganado
    sendWin: function(){
        var data = {
            nameGame: escenario.game.nameGame,
            player: Player.auto.id,
        };
        server.socket.emit("onWin", data);
    },

    disabledVelocity: function(){
        Player._velocity = "disabled";
    },
    // se une al juego establecido en escenario.game, y obitiene el id para esta jugador
    connect: function(onFinish) {
        var data = {
            idGame: escenario.game.id,
            //nameGame: escenario.game.nameGame,
            idPlayer: Player.auto.id,
        }
        server.socket.emit("joinPlayerInGame", data);
    },


/******************--auto--**********************/

    auto: {

        id: null,
        info: {
            point: {x:0, y:0},
            velocityX: 0,
            velocityY: 0,
        },

        init: function(id){
            Player.auto.id = id;
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
            Player.auto.info.velocityX = x;
            //escenario.game.players[player.auto.id].velocityX = x;
            if (escenario.isMultiplayer)
                Player.auto._sendMove();
        },

        setVelocityY: function(y){
            Player.auto.info.velocityY = y;
            //escenario.game.players[player.auto.id].velocityY = y;
            if (escenario.isMultiplayer)
                Player.auto._sendMove();
        },

        _sendMove: function(){
            var data = {
                idGame: escenario.game.id,
                idPlayer: Player.auto.id,
                //info: escenario.game.players[player.auto.id],
                info: Player.auto.info,
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