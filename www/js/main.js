

var main = {

    _games: null,

    init: function(){
        server.init(); // inicializa la conexion con el servidor
        escenario.init(true);
        server.socket.on('startGame', main.startGame); // espera mensaje del serivdor para iniciar juego

        /*
        inicializar eventos de los controles del formulario
        */

        //main.startGame(null);
        main.getGames();
    },

    // crea nuevo game
    createGame: function(){

        var nameGame = "juego " +  Math.round(Math.random() * 10000); // este dato se obtiene del formulario, getElemenById("...")...
        var noPlyers = 2; // esta dato se obtiene del formulario, getElemenById("...")...  

        /* activar loading ..... */ 
        escenario.createGame(nameGame, noPlyers, function(){
            tools.message("se ha creado juego: " + nameGame);

            /* desactivar loading .... */
        });

    },

    // obtiene los games disponibles
    getGames: function(){
        /* activar loading ..... */ 
        server.get("/game", {}, function(games){
            /* desactivar loading .... */
            main._games = games;
            /* llenar lista con variable games en interfaz... */


            // codigo temporal
            if (!main._games || main._games.length == 0) { // si no hay juego crea uno 
                main.createGame();
                main.getGames();
            } else {
                main.joinAtGame();
            } // termina codigo temporal


        });

    },

    joinAtGame: function(){
        var indexGame = 0; /* se obitene al seleccionar un elemento de la lista en la interfaz */
        escenario.setGame(main._games[indexGame]);
        /* activar loading ..... */ 
        player.connect(function(){
            /* desactivar loading .... */
            tools.message("se ha unido al a un juego: " + main._games[indexGame].nameGame);
        });
    },

    startGame: function(game){
        escenario.game = game;
        (function() {
            var game = new Phaser.Game(320, 480, Phaser.CANVAS, 'game-phaser');
            game.state.add('Boot', Ball.Boot);
            game.state.add('Preloader', Ball.Preloader);
            game.state.add('AdjustVelocity', Ball.AdjustVelocity);
            game.state.add('Game', Ball.Game);

            game.state.start('Boot');
        })();
    }

}
