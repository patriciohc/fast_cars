
var main = {

    _games: null,
    user: null,

    init: function() {
        server.init(); // inicializa la conexion con el servidor
        escenario.init(true);
        //Player.init();
        server.socket.on('startGame', main.startGame); // espera mensaje del serivdor para iniciar juego
        server.socket.on('newGame', main.getGames);

        var btnCreteGame = document.getElementById("btnCreateGame");
        btnCreteGame.onclick = main.createGame;
        var btnCancelJoin = document.getElementById("btnCancelJoin");
        btnCancelJoin.onclick = main.cancelJoin;
        var btnSalir = document.getElementById("btnSalir");
        btnSalir.onclick = main.logout;

        $("#mainGame").css({height:  $( window ).height()});
        //$("#loading").css({height:  $( window ).height() - 80});
        //main.startGame(null);
        main.getGames();

        var user = sessionStorage.getItem('usuario');
        if (user) {
            main.user = JSON.parse(user);
            main.loginStep2(main.user);
        }
    },

    entrar: function() {
        var user = {
            userName: $("#txtUsuario").val(),
            isGuest: true
        }
        server.post('/api/user', user, function(user){
            main.user = user;
            sessionStorage.setItem('usuario', JSON.stringify(user));
            main.loginStep2(main.user);
        });
    },

    loginStep2: function(user) {
        Player.init(user);
        $("#lbUser").html(user.userName);
        $("#inicio").hide();
        $("#datosUsuario").show();
    },

    cancelJoin: function(){
        server.socket.emit("cancelJoin", {idPlayer: Player.auto.id, idGame: escenario.game.id});
    },

    login: function() {

    },

    logout: function() {
        sessionStorage.clear();
        $("#lbUser").html('');
        $("#inicio").show();
        $("#datosUsuario").hide();
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
            if (n > 4 || n < 1){
                alert("El numero de jugadores debe ser de minimo 2 y maximo 4");
                return false;
            }

            return true;
        }

        if (!validarForm()) return;

        var nameGame = $("#nombreJuego").val();
        var noPlayers = parseInt($("#numeroPlayers").val());

        $("#nombreJuego").val("");
        $("#numeroPlayers").val("");

        // nameGame: nombre del juego
        // noPlayers: numero de jugadores
        var data = {
            nameGame: nameGame,
            noPlayers: noPlayers,
        }

        server.post('/api/game', data, function(game) {
            tools.message("se ha creado juego: " + game.nameGame);
            main.joinAtGame(game);
            server.socket.emit("newGame");
        });

    },

    // obtiene los games disponibles
    getGames: function(){

        var join = function (id) {
            var indexGame =this.indexGame;
            var game = main._games[indexGame];
            main.joinAtGame(game);
        };

        server.get("/api/game", {}, function(games){
            main._games = games;
            var lista = document.getElementById("listGames");
            if (!lista) return;
            lista.innerHTML = "";
            for(var i in main._games){
                var item = main._games[i];
                var li = document.createElement("li");
                li.innerHTML = item.nameGame;
                li.indexGame = i;
                li.className = "collection-item";
                li.style.cursor = "pointer";
                li.onclick = join;
                lista.appendChild(li);
            }
        });

    },

    joinAtGame: function(game) {
        escenario.setGame(game);
        $("#pleaseWaitDialog").modal('open');
        Player.connect();
    },

    startGame: function(){
        //$("#pleaseWaitDialog").modal("hide");
        $("#datosUsuario").hide();
        $("#loading").modal('open');
        (function() {
            var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.CANVAS, 'game-phaser');
            game.state.add('Boot', Ball.Boot);
            game.state.add('Preloader', Ball.Preloader);
            game.state.add('AdjustVelocity', Ball.AdjustVelocity);
            game.state.add('Game', Ball.Game);

            game.state.start('Boot');
        })();
    }

}


$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});
