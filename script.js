//initalize canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//load background image
const background = new Image();
background.src = 'assets/forest.png';

//draw background on canvas
function setBackground(){
  ctx.drawImage(background, 0,0);
  requestAnimationFrame(setBackground);
};
setBackground();
