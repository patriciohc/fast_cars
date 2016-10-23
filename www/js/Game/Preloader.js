Ball.Preloader = function(game) {};
Ball.Preloader.prototype = {
	preload: function() {
		// this.preloadBg = this.add.sprite((Ball._WIDTH-297)*0.5, (Ball._HEIGHT-145)*0.5, 'preloaderBg');
		// this.preloadBar = this.add.sprite((Ball._WIDTH-158)*0.5, (Ball._HEIGHT-50)*0.5, 'preloaderBar');
		// this.load.setPreloadSprite(this.preloadBar);

		this.load.image('llanta', 'images/llanta.png');
		this.load.image('meta', 'images/meta-1.png');
		// this.load.image('hole', 'img/hole.png');
		//this.load.image('element-w', 'img/element-w.png');
		//this.load.image('element-h', 'img/element-h.png');
		this.load.image('player-0', 'images/car/Mini_truck.png');
        this.load.image('player-1', 'images/car/Black_viper.png');
        this.load.image('player-2', 'images/car/Audi.png');
        this.load.image('player-3', 'images/car/Car.png');

		this.load.image('car-1', 'images/car/car-1.png');
		this.load.image('car-2', 'images/car/car-2.png');
		this.load.image('car-3', 'images/car/car-3.png');
		this.load.image('panel', 'img/panel.png');
		this.load.image('title', 'img/title.png');
		this.load.image('button-pause', 'img/button-pause.png');
		this.load.image('screen-bg', 'images/background.png');
		this.load.image('screen-mainmenu', 'img/screen-mainmenu.png');
		this.load.image('screen-howtoplay', 'img/screen-howtoplay.png');
		// this.load.image('border-horizontal', 'img/border-horizontal.png');
		// this.load.image('border-vertical', 'img/border-vertical.png');

		this.load.spritesheet('button-audio', 'img/button-audio.png', 35, 35);
		this.load.spritesheet('button-start', 'img/button-start.png', 146, 51);

		// this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']);

		this.load.image('backyard', 'assets/images/background-1.png');

        this.load.image('car0', 'assets/images/car/Audi.png');    
        this.load.image('car1', 'assets/images/car/Black_viper.png');    
        this.load.image('car2', 'assets/images/car/Car.png');
        this.load.image('car3', 'assets/images/car/Mini_truck.png');

        this.load.image('rotate', 'assets/images/rotate.png');
        this.load.spritesheet('police', 'assets/images/police.png', 32, 70, 3, 1, 1);

        // botones
        this.load.image('down', 'assets/images/interface_buttons/down_orange.png');    
        this.load.image('up', 'assets/images/interface_buttons/up_orange.png');    
        this.load.image('left', 'assets/images/interface_buttons/left_orange.png');
        this.load.image('rigth', 'assets/images/interface_buttons/right_orange.png');
	},
	create: function() {
		this.game.state.start('AdjustVelocity');
	}
};