

var main = {

    _games: null,

    init: function(){
        server.init(); // inicializa la conexion con el servidor
        escenario.init(true);
        Player.init();
        server.socket.on('startGame', main.startGame); // espera mensaje del serivdor para iniciar juego

        var btnCreteGame = document.getElementById("btnCreateGame");
        btnCreteGame.onclick = main.createGame;

        //main.startGame(null);
        main.getGames();
    },

    // crea nuevo game
    createGame: function(){

        var nameGame = $("#nombreJuego").val();
        var noPlyers = $("#numeroPlayers").val();

        escenario.createGame(nameGame, noPlyers, function(game){
            tools.message("se ha creado juego: " + nameGame);
            main.getGames();
            main.joinAtGame(game.id);
        });

    },

    // obtiene los games disponibles
    getGames: function(){
        server.get("/game", {}, function(games){
            main._games = games;
            var lista = document.getElementById("listGames");
            lista.innerHTML = "";
            for(var i in main._games){
                var item = main._games[i];
                var li = document.createElement("li");
                li.innerHTML = item.nameGame;
                li.idGame = item.id;
                li.className = "list-group-item";
                li.style.cursor = "pointer";
                li.onclick = main.joinAtGame;
                lista.appendChild(li);
            }

            // codigo temporal
            //if (!main._games || main._games.length == 0) { // si no hay juego crea uno 
            //    main.createGame();
            //    main.getGames();
            //} else {
            //    main.joinAtGame();
            //} // termina codigo temporal


        });

    },

    joinAtGame: function(id){
        var indexGame = id || this.idGame;
        escenario.setGame(main._games[indexGame]);
        $("#pleaseWaitDialog").modal();
        Player.connect();
    },

    startGame: function(game){
        $("#pleaseWaitDialog").modal("hide");
        $("#datosUsuario").hide();
        $("#game-phaser").show();
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
