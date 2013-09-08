var player = {
  x:250,
  y:250,
  radius:10,
  width:2,
  color:'white',
}
var bullets=[];
var Bullet = function(x,y){
  this.angle=Math.atan((y-player.y)/(x-player.x));
  this.pos=(x<=player.x?-1:1);
  console.log(this);
  this.x=x;
  this.y=y;
  this.radius=3;
  this.width=.5;
  this.color='red';
}
var Enemy = function(initHp){
  this.x=Math.random()*canvas.width;
  this.y=Math.random()*canvas.height;
  this.radius=Math.random()*30+10;
  this.width=2;
  this.color='gray';
  this.speed=Math.random()*10+5;
  this.hp=initHp;
}

function init(){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  document.addEventListener('mousedown',function(e) {
    e.preventDefault();
    keysDown['mouse']=true;
  },false);
  document.addEventListener('mouseup',function(e) {
    delete keysDown['mouse'];
    bullets.push(new Bullet(mousePos.x,mousePos.y));
  },false);
  document.addEventListener('mousemove',function(e) {
    mousePos = getMouseCoords(e);
  },false);
}
function run(){
  update();
  render();
  setTimeout(function(){
    run();
    /*fps*/increaseCount();
  },16.7)
}

/*fps stuff*/
var count=0;
function increaseCount(){
  count++;
}
setInterval(function(){
  document.getElementById("count").innerHTML='fps:'+count;
  count=0;
},1000);
/*end fps stuff*/

function update(){
  if('mouse' in keysDown){
   // bullets.push(new Bullet(mousePos.x,mousePos.y));
  }
}
function render(){
  renderBackground();
  renderPlayer();
  renderBullets();
}
function renderBackground(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}
function renderPlayer(){
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, 2*Math.PI, false);
  ctx.lineWidth = player.width;
  ctx.strokeStyle = player.color;
  ctx.stroke();
  ctx.closePath();
}
function renderBullets(){
  for (var i=0;i<bullets.length;i++){
    ctx.beginPath();
    ctx.arc(bullets[i].x, bullets[i].y, bullets[i].radius, 0, 2*Math.PI, false);
    ctx.lineWidth = bullets[i].width;
    ctx.strokeStyle = bullets[i].color;
    ctx.stroke();
    ctx.closePath();
  }
}
function getMouseCoords(event) {
  var x,y;
  x=(event.pageX);
  y=(event.pageY);
  x-=432;
  y-=10;
  return {"x": x, "y": y};
}