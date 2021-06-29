// Victor Derbier
// vderbier@ucsc.edu
// UCSC Summer 2021
// CMPM 120 Rocket Patrol Mod
// June 28th 2021

// Points breakdown:
//
// 20 - Finishing the tutorial
// 20 - particle effect when a spaceship is hit
// 20 - adds 4 seconds to the clock when a spaceship is hit
// 10 - added a timer on screen
// 30 - Simultaneous two player co-op mode
// -------
// 100 pts

// Code modified from Nathan Altice's tutorial

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyA, keyD, keyW, keyTWO;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
