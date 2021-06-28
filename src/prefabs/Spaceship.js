class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.scene = scene;
    }

    update() {
        this.x -= this.moveSpeed;
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }

    shipExplode() {
        // add time (4 seconds).
        this.scene.timer += 4000;

        // temporarily hide ship
        this.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.scene.add.sprite(this.x, this.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            this.reset();                         // reset ship position
            this.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        }); 
        
        // Make a particle effect where the ship died
        this.scene.particles.createEmitter({
            alpha: {start: 0.7, end: 0},
            scale: {start: 0.5, end: 1.5},
            speed: 20,
            accelerationY: -120,
            angle: {min: -85, max: -95},
            rotate: {min: -180, max: 180},
            lifespan: 700,//{min: 1000, max: 1000},
            blendMode:'ADD',
            frequency: 110,
            maxParticles: 7,
            x: this.x + this.width/2,
            y: this.y + this.height/2// x and y.
        });

        // setTimeout(() => {
        //     ship.reset();                         // reset ship position
        //     ship.alpha = 1;                       // make ship visible again
        // }, 1500);                         // delay respawn for 1.5 sec for the explosion to finish.

        // // update points for ship destroyed
        // this.p1score += ship.points;
        // this.scoreLeft.text = this.p1score;    
        
        // play explosion sound
        this.scene.sound.play('sfx_explosion');
    }
}