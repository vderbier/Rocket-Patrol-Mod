class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/ title 
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        // load particle
        this.load.image('fire', './assets/muzzleflash3.png');
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // common restart key
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        // define p1 keys
        let p1KeyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        let p1KeyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        let p1KeyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // define p2 keys
        let p2KeyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        let p2KeyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        let p2KeyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


        // add rocket (p1)
        this.rockets = new Array();
        this.rockets.push(new Rocket(
            this,
            game.config.width/4, 
            game.config.height - borderUISize - borderPadding,
            'rocket',
            p1KeyF,
            p1KeyLEFT,
            p1KeyRIGHT
            ).setOrigin(0.5, 0));
        this.rockets.push( new Rocket(
            this,
            3 * game.config.width/4, 
            game.config.height - borderUISize - borderPadding, 
            'rocket', 
            p2KeyF, 
            p2KeyLEFT, 
            p2KeyRIGHT
            ).setOrigin(0.5, 0));
            
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        // animation config
        this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30
        });

        // init score to 0
        this.p1score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        } 
        // score
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1score, scoreConfig);
        console.log(borderUISize + borderPadding);

        // time left in seconds.
        console.log(game.config.width - borderUISize + borderPadding);
        this.timeLeft = this.add.text(game.config.width - (borderUISize + borderPadding*2)*3, borderUISize + borderPadding * 2, this.game.settings.gameTimer/1000, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        this.timer = game.settings.gameTimer;
        console.log(this.timer);
        // 60 seconds play clock
        scoreConfig.fixedWidth = 0; 
        this.clock = setInterval(() => {
            this.timer -= 1000; // minus 1 every second.
            this.timeLeft.text = this.timer/1000;
            console.log(this.timer);
            if (this.timer <= 0) {
                clearInterval(this.clock);
                this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
                this.gameOver = true;
            }
        }, 1000);

        // make particle effect
        this.particles = this.add.particles('fire');
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {      // stop updating once time is up
            this.rockets[0].update();
            this.rockets[1].update(); 
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        for (var i = 0; i < this.rockets.length; i++) {
            if (this.checkCollision(this.rockets[i], this.ship03)) {
                this.rockets[i].reset();
                this.ship03.shipExplode();
                // update points for ship destroyed
                this.p1score += this.ship03.points;
            }

            if (this.checkCollision(this.rockets[i], this.ship02)) {
                this.rockets[i].reset();   
                this.ship02.shipExplode(); 
                this.p1score += this.ship02.points;   
            }

            if (this.checkCollision(this.rockets[i], this.ship01)) {
                this.rockets[i].reset(); 
                this.ship01.shipExplode();
                this.p1score += this.ship01.points;
            }
            this.scoreLeft.text = this.p1score;  
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x + ship.width &&
            rocket.y < ship.y + ship.height &&
            rocket.y + rocket.height > ship.y) {
                return true;
        }
        return false;
    }

    // shipExplode(ship) {
    //     // add time (4 seconds).
    //     this.timer += 4000;

    //     // temporarily hide ship
    //     ship.alpha = 0;
    //     // create explosion sprite at ship's position
    //     let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
    //     boom.anims.play('explode');             // play explode animation
    //     boom.on('animationcomplete', () => {    // callback after anim completes
    //         ship.reset();                         // reset ship position
    //         ship.alpha = 1;                       // make ship visible again
    //         boom.destroy();                       // remove explosion sprite
    //     }); 
        
    //     // Make a particle effect where the ship died
    //     this.particles.createEmitter({
    //         alpha: {start: 0.7, end: 0},
    //         scale: {start: 0.5, end: 1.5},
    //         speed: 20,
    //         accelerationY: -120,
    //         angle: {min: -85, max: -95},
    //         rotate: {min: -180, max: 180},
    //         lifespan: 700,//{min: 1000, max: 1000},
    //         blendMode:'ADD',
    //         frequency: 110,
    //         maxParticles: 7,
    //         x: ship.x + ship.width/2,
    //         y: ship.y + ship.height/2// x and y.
    //     });

    //     // setTimeout(() => {
    //     //     ship.reset();                         // reset ship position
    //     //     ship.alpha = 1;                       // make ship visible again
    //     // }, 1500);                         // delay respawn for 1.5 sec for the explosion to finish.

    //     // update points for ship destroyed
    //     this.p1score += ship.points;
    //     this.scoreLeft.text = this.p1score;    
        
    //     // play explosion sound
    //     this.sound.play('sfx_explosion');
    // }
}
