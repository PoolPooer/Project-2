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


  update(deltatime){
    if (this.y < 0 || this.y > canvas.height - this.height){
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    this.timeSinceFlap += deltatime;
    if(this.timeSinceFlap > this.flapInterval){
      if(this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }
    // if a bee reaches the left side of the screen its game over
    if(this.x < 0 - this.width) gameOver = true;
  }

  draw(){
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

//copy of bees, assigned explosion effects where succesful
let explosions = [];
class Explosion {
  constructor(x, y, size){
    this.image = new Image();
    this.image.src = 'assets/boom.png';
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio ();
    this.sound.src = 'assets/boom.wav';
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.markedForDeletion = false;
  }
  update(deltatime){
    if (this.frame === 0) this.sound.play();
    this.timeSinceLastFrame += deltatime;
    if (this.timeSinceLastFrame > this.frameInterval){
      this.frame++;
      this.timeSinceLastFrame = 0;
      if(this.frame > 5) this.markedForDeletion = true;
    }
  }

  draw(){
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size);
  }
}

//display score with background layer
function drawScore(){
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 50, 75);
  ctx.fillStyle = 'orange';
  ctx.fillText('Score: ' + score, 55, 80);
}

//display final score and end of game state with background layer
function drawGameOver(){
  ctx.textAlign = 'center'
  ctx.fillStyle = 'black';
  ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2, canvas.height/2);
  ctx.fillStyle = 'orange';
  ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2 + 5, canvas.height/2 + 5);
}

//event listener for mouse click
window.addEventListener('click', function(e){
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
  const pc = detectPixelColor.data;
  bees.forEach(object => {
    if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
      object.markedForDeletion = true;
      score++;
      explosions.push(new Explosion(object.x, object.y, object.width));
    }
  });
});

const bee = new Bee();
//function to call different sized bee
function animate(timestamp){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextBee += deltatime;
  if (timeToNextBee > beeInterval){
    bees.push(new Bee());
    timeToNextBee = 0;
    bees.sort(function(a,b){
      return a.width - b.width;
    });
  };
  //place background image
  ctx.drawImage(background, 0, 0);
  drawScore();
  [...bees, ...explosions].forEach(object => object.update(deltatime));
  [...bees, ...explosions].forEach(object => object.draw());
  bees = bees.filter(object => !object.markedForDeletion);
  explosions = explosions.filter(object => !object.markedForDeletion);
  if(!gameOver) requestAnimationFrame(animate);
  else drawGameOver();

}
animate(0);
