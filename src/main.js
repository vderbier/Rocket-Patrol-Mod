// Victor Derbier
// vderbier@ucsc.edu
// UCSC Summer 2021
// CMPM 120 Rocket Patrol Mod

// All of the code for this project is from Nathan Altice.

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyA, keyD, keyW;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
