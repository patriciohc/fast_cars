Ball.Game = function(game) {};
Ball.Game.prototype = {
	create: function() {
		this.roadLength = escenario.roadLength;

		this.add.tileSprite(0, 0, 320, this.roadLength, 'screen-bg');

		this.add.sprite(0, 100, 'meta');
		//this.add.sprite(0, 0, 'screen-bg');

		this.world.setBounds(0, 0, 320, this.roadLength);

		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.fontSmall = { font: "16px Arial", fill: "#e4beef" };
		this.fontBig = { font: "20px Arial", fill: "#e4beef" };
		this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
		this.audioStatus = true;
		this.timer = 150;
		this.totalTimer = 0;
		//this.level = 1;
		//this.maxLevels = 5;
		//this.movementForce = 5;
		//this.ballStartPos = { x: 20 + Ball._WIDTH*0.15 * player.auto.id, y: this.roadLength - 200 };

		this.panel = this.add.group();

		var backgroundPanel = this.add.sprite(0, 0, 'panel');
		this.panel.add(backgroundPanel);

		this.pauseButton = this.add.button(Ball._WIDTH-8, 8, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.input.useHandCursor = true;
		this.panel.add(this.pauseButton);

		this.audioButton = this.add.button(Ball._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);
		this.audioButton.anchor.set(1,0);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);
		this.panel.add(this.audioButton);

		this.timerText = this.game.add.text(15, 15, "Km/h: "+ 0, this.fontBig);
		this.panel.add(this.timerText);

		//this.levelText = this.game.add.text(120, 10, "Level: "+this.level+" / "+this.maxLevels, this.fontSmall);
		//this.panel.add(this.levelText);

		this.levelText = this.game.add.text(120, 10, "Lugar: "+ 0 +" / "+ escenario.game.noPlayers, this.fontSmall);
		this.panel.add(this.levelText);

		this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontSmall);
		this.panel.add(this.totalTimeText);

		this.panel.setAll("fixedToCamera", true);
		//this.timerText.fixedToCamera = true;
		//this.timerText.cameraOffset.setTo(15, 15);

		this.players = new Array(escenario.game.noPlayers);

		for (var i = 0; i < this.players.length; i++){
			this.players[i] = {};
			this.players[i].id = escenario.players[i].id;
			this.players[i].graphics = this.add.sprite(
				(60 + Ball._WIDTH * 0.15 * i),
				(this.roadLength - 200),
				'player-' + i
			);
			this.players[i].graphics.anchor.set(0.5);
			this.physics.enable(this.players[i].graphics, Phaser.Physics.ARCADE);
			this.players[i].graphics.body.setSize(30, 68);
			this.players[i].graphics.body.collideWorldBounds = true;

			if (this.players[i].id == Player.auto.id) { // si se cumple se trata de este player
				this.game.camera.follow(this.players[i].graphics);
				this.game.camera.deadzone = new Phaser.Rectangle(0, 400, 80, 80);
				Ball._player = this.players[i].graphics;
			}
		}

/*		this.ball.body.collideWorldBounds = true;*/

		//this.initLevels();
		//this.showLevel();

		//this.keys = this.game.input.keyboard.createCursorKeys();
		this.game.input.keyboard.onUpCallback = this.eventUpKeyBoard;
		this.game.input.keyboard.onDownCallback = this.eventDownKeyBoard;

		window.addEventListener("deviceorientation", this.handleOrientation, true);
		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
		this.bounceSound = this.game.add.audio('audio-bounce');
		this.showObstaculos();
	},

	eventUpKeyBoard: function(evt){

		switch(evt.key){
			case "ArrowUp":
				Player.incVelocity();
				break;

			case "ArrowDown":
				Player.decVelocity();
				break;

			case "ArrowLeft":
				Player.xNotMove();
				break;

			case "ArrowRight":
				Player.xNotMove();
				break;
		}

	},

	eventDownKeyBoard: function(evt){

		switch(evt.key){
			case "ArrowLeft":
				Player.moveLeft();
				break;

			case "ArrowRight":
				Player.moveRight();
				break;
		}
	},


	showObstaculos: function() {

		this.carsNoPlayers = this.add.group();
		this.carsNoPlayers.enableBody = true;
		this.carsNoPlayers.physicsBodyType = Phaser.Physics.ARCADE;
		for(var e=0; e<escenario.carsNoPlayers.length; e++) {
			var item = escenario.carsNoPlayers[e];
			this.carsNoPlayers.create(item.x, item.y, 'car-' + item.t );
		}
		this.carsNoPlayers.setAll("body.velocity.y", - Math.floor((Math.random() * 400) + 50));
			//newLevel.visible = false;
			//this.levels.push(newLevel);

		this.obstaculos = this.add.group();
		this.obstaculos.enableBody = true;
		this.obstaculos.physicsBodyType = Phaser.Physics.ARCADE;
		for(var e=0; e<escenario.obstaculos.length; e++) {
			var item = escenario.obstaculos[e];
			this.obstaculos.create(item.x, item.y, 'obstaculo-' + item.t);
		}
		this.obstaculos.setAll('body.immovable', true);
			//newLevel.setAll("body.velocity.y", - Math.floor((Math.random() * 400) + 50));
			//this.obstaculos.visible = false;
			//this.llantas.push(llantas);

	},

	updateCounter: function() {
		this.timer--;

		if (this.timer <= 0) {
			//this.gameOver();
		}

		//if (player.auto.velocity != 0)
		//	player.auto.velocityY -= 4; // incrementa velocidad miestras no choque
		var v = Math.round10( Math.abs(Ball._player.body.velocity.y / 3), -1) // km/h
		this.timerText.setText("Time: "+(this.timer)); // tiempo restante
		this.totalTimeText.setText("Km/h: "+ v); // km/h
	},

	managePause: function() {
		this.game.paused = true;
		var pausedText = this.add.text(Ball._WIDTH*0.5, 250, "Game paused,\ntap anywhere to continue.", this.fontMessage);
		pausedText.anchor.set(0.5);
		this.input.onDown.add(function(){
			pausedText.destroy();
			this.game.paused = false;
		}, this);
	},

	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	},

	update: function() {
		//player.auto.point = this.ball.position;

		this.players.sort(function (a, b) {
  			if (a.graphics.position.y > b.graphics.position.y) {
    				return 1;
  			}
  			if (a.graphics.position.y < b.graphics.position.y) {
    				return -1;
  			}
  			return 0;
		});

		for (var i in this.players){
			var player = this.players[i];
			var graphics = player.graphics;

			if (graphics === null)
				continue;

			var info = escenario.game.players.find(function(item){
				if (item.id === player.id)
					return true;
				else
					return false;
			}).info;

			if (info === null)
				continue;

			graphics.body.velocity.x = info.velocityX;
			graphics.body.velocity.y = info.velocityY;

			this.physics.arcade.collide(graphics, this.carsNoPlayers, this.wallCollision, null, this);
			this.physics.arcade.collide(graphics, this.obstaculos, this.wallCollision, null, this);

			if (player.id == Player.auto.id){
				this.levelText.setText("Lugar: "+ (parseInt(i) + 1) +" / "+ escenario.game.players.length);
				if (graphics.position.y <= 100 ){
					Player.sendWin();
				}
			}

			// reubicamos el auto
			// if (this.players[i].position.x > p.point.x + t || this.players[i].position.x < p.point.x - t ||
			// 	this.players[i].position.y > p.point.y + t || this.players[i].position.y < p.point.y - t ){
			// 	this.players[i].position.x = p.point.x;
			// 	this.players[i].position.y = p.point.y;
			// }
		}

		//this.physics.arcade.collide(this.ball, this.borderGroup, this.wallCollision, null, this);
		//this.physics.arcade.collide(this.ball, this.levels[this.level-1], this.wallCollision, null, this);
		//this.physics.arcade.collide(this.ball, this.llantas[this.level-1], this.wallCollision, null, this);
		//this.physics.arcade.overlap(this.ball, this.hole, this.finishLevel, null, this);
	},

	wallCollision: function(obj1, obj2) {
		if(this.audioStatus) {
			this.bounceSound.play();
		}
		// Vibration API
		if("vibrate" in window.navigator) {
			window.navigator.vibrate(100);
		}


		var angulo = Player._velocity * 360;

		Player.resetVelocity();
		Player.disabledVelocity();

		var petRotation = this.add.tween(obj1);
      	petRotation.to({ angle: angulo }, 1000 * (angulo/360) );
      	petRotation.onComplete.add(function(){
      		Player.resetVelocity();
      	}, this);
      	petRotation.start();

	},
	handleOrientation: function(e) {
		// Device Orientation API
		var x = e.gamma; // range [-90,90], left-right
		var y = e.beta;  // range [-180,180], top-bottom
		var z = e.alpha; // range [0,360], up-down
		//Ball._player.body.velocity.x += x;
		//Ball._player.body.velocity.y += y*0.5;
	},

	finishLevel: function() {
		if(this.level >= this.maxLevels) {
			this.totalTimer += this.timer;
			alert('Congratulations, game completed!\nTotal time of play: '+this.totalTimer+' seconds!');
			this.game.state.start('MainMenu');
		}
		else {
			alert('Congratulations, level '+this.level+' completed!');
			this.totalTimer += this.timer;
			this.timer = 150;
			this.level++;
			this.timerText.setText("Time: "+this.timer);
			this.totalTimeText.setText("Total time: "+this.totalTimer);
			this.levelText.setText("Level: "+this.level+" / "+this.maxLevels);
			//this.ball.body.x = this.ballStartPos.x;
			//this.ball.body.y = this.ballStartPos.y;
			//this.ball.body.velocity.x = 0;
			//this.ball.body.velocity.y = 0;
			this.showLevel();
		}
	},
	render: function() {
		// this.game.debug.body(this.ball);
		// this.game.debug.body(this.hole);
	}

};
