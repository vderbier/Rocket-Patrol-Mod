class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // menu text config
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        } 

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding,
             'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ← → arrows to move & (F) to fire', 
            menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding,
            'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        
        menuConfig.backgroundColor = '#ADD8E6';
        
        this.add.text(game.config.width/2, 3*game.config.height/4 - borderUISize,
            'Press 2 for two player co-op', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, 3*game.config.height/4 + borderPadding,
            'Use (A)(D) to move & (W) to fire', menuConfig).setOrigin(0.5);
    

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyTWO =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        // boolean value for two players
        this.isCoop = false;
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
              isCoop: this.isCoop,
              spaceshipSpeed: 3,
              gameTimer: 60000    
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
              isCoop: this.isCoop,
              spaceshipSpeed: 4,
              gameTimer: 45000    
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
            // two players
            this.isCoop = true;
            this.sound.play('sfx_select');
        }
    }
}