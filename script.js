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
