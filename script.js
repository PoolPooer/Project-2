const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Image();
background.src = 'forest.png';

function setBackground(){
  ctx.drawImage(background, 0,0);
  requestAnimationFrame(setBackground);
};
setBackground();
