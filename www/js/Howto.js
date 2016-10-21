Ball.Howto = function(game) {};

Ball.Howto.prototype = {
	create: function() {

        //player.connect();
		//this.buttonCrearNuevo = this.add.button(0, 0, 'screen-howtoplay', this.startGame, this);
        //this.buttonUnirse = this.add.button(0, 0, 'screen-howtoplay', this.startGame, this);
        escenario.init(true);

        this.createGame = this.add.button(Ball._WIDTH*0.5, 100, 'button-start', this.createGame, this, 2, 0, 1);
        this.createGame.anchor.set(0.5,0);
        this.createGame.input.useHandCursor = true;

        this.showGamesAvailable();

        this.startGame = this.add.button(Ball._WIDTH*0.5, 400, 'button-start', this.startGame, this, 2, 0, 1);
        this.startGame.anchor.set(0.5,0);
        this.startGame.input.useHandCursor = true;

	},

    createGame: function(){
        var noPlayers = 2; // numero de jugadores
        escenario.createGame("nombre Juego..", noPlayers);   
    },

    showGamesAvailable: function(){
        var ctx = this;

        var joinGame = function(btn){
            escenario.joinGame(btn.dataGame);
        }

        // mostar juegos disponibles, consultando al servidor mediante GET game
        var createButtons = function(games){
            var posY = 180;
            ctx.joinGame = new Array(games.length);
            for (var i in games){
                ctx.joinGame[i] = ctx.add.button(Ball._WIDTH*0.5, posY, 'button-start', joinGame, ctx, 2, 0, 1);
                ctx.joinGame[i].anchor.set(0.5,0);
                ctx.joinGame[i].input.useHandCursor = true;
                ctx.joinGame[i].dataGame = games[i];
                posY += 60;
            }
        };

        server.get("/game", {}, createButtons);

    },

    joinGame: function(){
        //escenario.joinGame(btn.game);
    },

	startGame: function() {
        if ( player.auto == null ) {
            tools.message("Conectando con el servidor, espere un momento porfavor..");
            return;
        }
        if ( escenario.game.status != "running"){
            tools.message("En espera de jugadores");
            return;
        }
        this.game.state.start('Game');
	}
};