Ball.Game = function(game) {};
Ball.Game.prototype = {
	create: function() {
		this.roadLength = 50000;

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
		this.level = 1;
		this.maxLevels = 5;
		this.movementForce = 5;
		this.velocity = 0;
		this.ballStartPos = { x: 20 + Ball._WIDTH*0.15 * player.auto.id, y: this.roadLength - 200 };

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

		this.levelText = this.game.add.text(120, 10, "Level: "+this.level+" / "+this.maxLevels, this.fontSmall);
		this.panel.add(this.levelText);

		this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontSmall);
		this.panel.add(this.totalTimeText);

		this.panel.setAll("fixedToCamera", true);
		//this.timerText.fixedToCamera = true;
		//this.timerText.cameraOffset.setTo(15, 15);

		this.players = new Array(escenario.game.players.length);

		for (var i in escenario.game.players){
			var p = escenario.game.players[i];
			p.point.x = 60 + Ball._WIDTH*0.15 * i;
			p.point.y = this.ballStartPos.y
			this.players[i] = this.add.sprite(p.point.x, p.point.y, 'player-' + i);
			this.players[i].anchor.set(0.5);
			this.physics.enable(this.players[i], Phaser.Physics.ARCADE);
			this.players[i].body.setSize(30, 68);
			this.players[i].body.collideWorldBounds = true;

			if (i == player.auto.id){
				this.game.camera.follow(this.players[i]);
				this.game.camera.deadzone = new Phaser.Rectangle(0, 400, 80, 80);
				Ball._player = this.players[i];
			}
		}

/*		this.ball = this.add.sprite(this.ballStartPos.x, this.ballStartPos.y, 'ball');
		this.ball.anchor.set(0.5);
		this.physics.enable(this.ball, Phaser.Physics.ARCADE);
		this.ball.body.setSize(30, 68);
		//this.ball.body.bounce.set(0.1, 0.1);
		this.ball.body.collideWorldBounds = true;*/

		this.initLevels();
		this.showLevel();



		//this.keys = this.game.input.keyboard.createCursorKeys();
		this.game.input.keyboard.onUpCallback = this.eventUpKeyBoard;
		this.game.input.keyboard.onDownCallback = this.eventDownKeyBoard;

		//Ball._player = this.ball;
		window.addEventListener("deviceorientation", this.handleOrientation, true);

		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

		this.bounceSound = this.game.add.audio('audio-bounce');

		//player.init();
	},

	eventUpKeyBoard: function(evt){

		switch(evt.key){
			case "ArrowUp":
				player.incVelocity();
				break;

			case "ArrowDown": 
				player.decVelocity();
				break;

			case "ArrowLeft":
				player.xNotMove();
				break;

			case "ArrowRight":			
				player.xNotMove();
				break;
		}

	},

	eventDownKeyBoard: function(evt){

		switch(evt.key){
			case "ArrowLeft":
				player.moveLeft();
				break;

			case "ArrowRight":
				player.moveRight();
				break;
		}
	},


	initLevels: function() {
		var getObstaculos = function(nObstaculos, minX, maxX, minY, maxY){
			var obstaculos = [];
			for (var i = 0; i < nObstaculos; i++) {
				obstaculos.push( tools.getRandomPoint(minX, maxX, minY, maxY) );
			}
			return obstaculos;
		};


		this.levels = [];
		this.llantas = [];
		this.carsNoPlayers = [
			getObstaculos(20, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
			getObstaculos(40, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
			getObstaculos(60, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
			getObstaculos(80, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
			getObstaculos(100, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
		];

		this.obstaculos = [
			getObstaculos(10, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
			getObstaculos(20, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
			getObstaculos(30, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
			getObstaculos(40, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
			getObstaculos(50, 80, 200, 1000, this.roadLength+(this.roadLength*0.1)),
		];

		for(var i=0; i<this.maxLevels; i++) {
			var newLevel = this.add.group();
			newLevel.enableBody = true;
			newLevel.physicsBodyType = Phaser.Physics.ARCADE;
			for(var e=0; e<this.carsNoPlayers[i].length; e++) {
				var item = this.carsNoPlayers[i][e];
				newLevel.create(item.x, item.y, 'car-' + Math.ceil(Math.random() * 3));
			}
			newLevel.setAll("body.velocity.y", - Math.floor((Math.random() * 400) + 50));
			newLevel.visible = false;
			this.levels.push(newLevel);


			var llantas = this.add.group();
			llantas.enableBody = true;
			llantas.physicsBodyType = Phaser.Physics.ARCADE;
			for(var e=0; e<this.obstaculos[i].length; e++) {
				var item = this.obstaculos[i][e];
				llantas.create(item.x, item.y, 'llanta');
			}
			llantas.setAll('body.immovable', true);
			//newLevel.setAll("body.velocity.y", - Math.floor((Math.random() * 400) + 50));
			llantas.visible = false;
			this.llantas.push(llantas);

		}
	},

	showLevel: function(level) {
		var lvl = level | this.level;
		if(this.levels[lvl-2]) {
			this.levels[lvl-2].visible = false;
		}
		this.levels[lvl-1].visible = true;
		this.llantas[lvl-1].visible = true;
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
		// player.auto.point = this.ball.position;

		// this.ball.body.velocity.x = player.auto.getVelocityX();

		// if (this.ball.position.y <= 110) {
		// 	this.finishLevel();
		// }

		// if (player._velocity == "disabled") {
		// 	this.ball.body.velocity.y = 0;	
		// } else {
		// 	this.ball.body.velocity.y = player.auto.getVelocityY();
		// }

		var t = 10; // tolerancia
		for (var i in escenario.game.players){
			
			var p = escenario.game.players[i];
			
			if (p == null)
				continue;

			this.players[i].body.velocity.x = p.velocityX;
			this.players[i].body.velocity.y = p.velocityY;

			this.physics.arcade.collide(this.players[i], this.levels[this.level-1], this.wallCollision, null, this);
			this.physics.arcade.collide(this.players[i], this.llantas[this.level-1], this.wallCollision, null, this);
			
			if (i == player.auto.id){

				continue;
			} // este jugador

			// reubicamos el auto
			// if (this.players[i].position.x > p.point.x + t || this.players[i].position.x < p.point.x - t || 
			// 	this.players[i].position.y > p.point.y + t || this.players[i].position.y < p.point.y - t ){
			// 	this.players[i].position.x = p.point.x;
			// 	this.players[i].position.y = p.point.y;
			// }
			//this.physics.arcade.moveToXY(this.player2, p.point.x, p.point.y, 500);				
		}

		//this.physics.arcade.collide(this.ball, this.borderGroup, this.wallCollision, null, this);
		//this.physics.arcade.collide(this.ball, this.levels[this.level-1], this.wallCollision, null, this);
		//this.physics.arcade.collide(this.ball, this.llantas[this.level-1], this.wallCollision, null, this);
		//this.physics.arcade.overlap(this.ball, this.hole, this.finishLevel, null, this);
	},

	wallCollision: function(evt) {
		if(this.audioStatus) {
			this.bounceSound.play();
		}
		// Vibration API
		if("vibrate" in window.navigator) {
			window.navigator.vibrate(100);
		}

		
		var angulo = 0;
		if ( player.auto.velocity == 1 ){
			angulo = 360;
		} else if ( player.auto.velocity == 2 ){
			angulo = 720;
		} else if ( player.auto.velocity == 3 ) {
			angulo = 1080;
		} else if ( player.auto.velocity == 4 ) {
			angulo = 1440;
		}

		player.resetVelocity();
		player._velocity = "disabled";

		// var petRotation = this.add.tween(this.ball);
  //     	petRotation.to({ angle: angulo }, 1000 * (angulo/360) );
  //     	petRotation.onComplete.add(function(){
  //     		player.resetVelocity();
  //     	}, this);
  //     	petRotation.start();

	},
	handleOrientation: function(e) {
		// Device Orientation API
		var x = e.gamma; // range [-90,90], left-right
		var y = e.beta;  // range [-180,180], top-bottom
		var z = e.alpha; // range [0,360], up-down
		Ball._player.body.velocity.x += x;
		Ball._player.body.velocity.y += y*0.5;
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