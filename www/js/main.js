

var main = {

    _games: null,
    user: null,

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

    entrar: function() {
        var user = {
            userName: $("#txtUsuario").val(),
            isGuest: true
        }
        server.post('/api/user', user, function(user){
            main.user = user;
            $("#lbUser").html(user.userName);
            $("#inicio").hide();
            $("#datosUsuario").show();
        });
    },

    login: function(){

    },

    register: function() {

    },

    // crea nuevo game
    createGame: function(){

        var validarForm = function() {

            if (!$("#nombreJuego").val() || !$("#numeroPlayers").val()){
                alert("Ingrese nombre del juego y numero de jugadores");
                return false;
            }
            var n = parseInt($("#numeroPlayers").val());
            if (isNaN(n)){
                alert("Indique el numero de jugadores");
                return false; 
            }
            if (n > 4 || n < 2){
                alert("El numero de jugadores debe ser de minimo 2 y maximo 4");
                return false;
            }

            return true;
        }

        if (!validarForm()) return;

        var nameGame = $("#nombreJuego").val();
        var noPlyers = parseInt($("#numeroPlayers").val());

        $("#nombreJuego").val("");
        $("#numeroPlayers").val("");


        escenario.createGame(nameGame, noPlyers, function(game){
            tools.message("se ha creado juego: " + nameGame);
            var setGame = function(){
                main.joinAtGame(game.id);
            }
            main.getGames(setGame);
        });

    },

    // obtiene los games disponibles
    getGames: function(success){
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

            if (success)
                success();
        });

    },

    joinAtGame: function(id){
        var indexGame;
        if (!isNaN(id))
            indexGame = id;
        else 
            indexGame =this.idGame;

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
