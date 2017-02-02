/*
Ajusta velocidad para que todos los dispositivos
se sincronicen correctamanete
*/

Ball.AdjustVelocity = function(game) {};

Ball.AdjustVelocity.prototype = {
	create: function() {
		this.TIEMPO = 5000; // timpo deseado recorrer extremo a extremo
		this.TOLERANCIA = 100; // tolerancia en milisegundos

		this.velocity = 100;
		this.timeInit = new Date().getTime();

		this.vd = 290 / this.TIEMPO; // velocidad deseada

		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.test = this.add.sprite(15, 0, 'player-1');
		this.test.anchor.set(0.5);
		this.physics.enable(this.test, Phaser.Physics.ARCADE);

		this.test.body.setSize(30, 68);
		this.test.body.collideWorldBounds = true;

		this.test.body.velocity.x = 100;

	},

	update: function() {

		if (Math.round(this.test.position.x) >= 305) {
			var newTime = new Date().getTime();
			var time = newTime - this.timeInit;

			var v = 290 / time; // velocidad actual

			if (this.TIEMPO - this.TOLERANCIA < time && this.TIEMPO + this.TOLERANCIA > time ) {
				console.log("velocidad ajustada correctamente,  tiempo obtenido: " + time);
				Player.setFactorVelocity(this.velocity * 2, this.velocity * 3);
				$("#mainGame").show();
				$("#loading").hide();
				this.game.state.start('Game');
				return;
			}

			this.velocity = (this.vd * this.velocity) / v;

			this.test.body.velocity.x = 0;

			this.test.position.x = 15;
			this.test.position.y = 0;

			this.timeInit = new Date().getTime();
		} else {
			this.test.body.velocity.x = this.velocity;
		}

		// if (this.test.position.y >= 300) {
		// 	var newTime = new Date().getTime();
		// 	var time = newTime - this.timeInit;
		// 	alert("counter y: " + this.counter);

		// 	//this.test.body.velocity.x = 0;
		// 	//this.test.body.velocity.y = 0;

		// 	//this.test.position.x = 0;
		// 	//this.test.position.y = 0;

		// 	this.test.body.velocity.x = 100;

		// }
	},


};
