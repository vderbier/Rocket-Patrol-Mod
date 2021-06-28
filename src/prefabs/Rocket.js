// Rocket Prefabs
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, kF, kL, kR) {
        var frame = undefined;
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        this.isFiring = false;     // is the rocket firing
        this.moveSpeed = 2;        // pixels per frame

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx

        this.kF = kF;
        this.kL = kL;
        this.kR = kR;
    }

    update() {
        // left/right movement
        if (!this.isFiring) {
            if(this.kL.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (this.kR.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        // fire button
        if (Phaser.Input.Keyboard.JustDown(this.kF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play(); // play firing sfx
        }
        // if fired, move up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
    }
}
