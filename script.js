//initalize primary canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//second canvas using colour, will be hidden and used for hit decection
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

//load background image
const background = new Image();
background.src = 'assets/forest.png';

let score = 0;
let gameOver = false;
ctx.font = '50px Impact';

//time between bees
let timeToNextBee = 0;
let beeInterval = 500;
let lastTime = 0;

//constructor for creating the bees
let bees = [];
class Bee {
  constructor(){
    //sprite dimensions
    this.spriteWidth = 247.5;
    this.spriteHeight = 269;
    //random size modifier for varied bees
    this.sizeModifer = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifer;
    this.height = this.spriteHeight * this.sizeModifer;
    //bees start at right and will fly to the left side
    this.x = canvas.width;
    //bees start in full view on canvas and not partially obscured
    this.y = Math.random() * (canvas.height - this.height);
    //random generate spawn locations
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    // default state upon spawning in
    this.markedForDeletion = false;
    //load new bee image
    this.image = new Image();
    this.image.src = 'assets/bee.png';
    //frame selection on sprite sheet
    this.frame = 0;
    this.maxFrame = 2;
    //offset the animations between different bees
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 20 + 50;
    //assign different colors on second canvas for hit dection upon mouse click
    this.randomColors = [Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)];
    this.color = 'rgb(' + this.randomColors[0] +  ',' + this.randomColors[1] +  ',' + this.randomColors[2] + ')';

  }
