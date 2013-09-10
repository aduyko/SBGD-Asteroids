//game objects
var points = 0;
var player = {
  x:250,
  y:250,
  radius:10,
  width:2,
  color:'white',
  speed:2,
}
var mouseChaser = {
  x:0,
  y:0,
  spawnDistance:15,
  radius:3,
  width:.5,
  color:'white',
  update: function(x,y){
    angle=Math.atan((y-player.y)/(x-player.x));
    pos=(x<player.x?-1:1);
    this.x=player.x+this.spawnDistance*Math.cos(angle)*pos;
    this.y=player.y+this.spawnDistance*Math.sin(angle)*pos;
  },
}
var bullets=[];
var Bullet = function(x,y){
  this.angle=Math.atan((y-player.y)/(x-player.x));
  this.pos=(x<player.x?-1:1);
  this.spawnDistance=15;
  this.x=player.x+this.spawnDistance*Math.cos(this.angle)*this.pos;
  this.y=player.y+this.spawnDistance*Math.sin(this.angle)*this.pos;
  this.radius=3;
  this.width=.5;
  this.color='red';
  this.speed=5;
  this.move=function(){
    this.x+=this.speed*Math.cos(this.angle)*this.pos;
    this.y+=this.speed*Math.sin(this.angle)*this.pos;
  }
  this.isDead=function(){
    if (this.x+this.radius>canvas.width) return true;
    if (this.x-this.radius<0) return true;
    if (this.y+this.radius>canvas.height) return true;
    if (this.y-this.radius<0) return true;
  }
}
var enemies=[];
var Enemy = function(initHp){
  this.angle=Math.random()*2*Math.PI;
  this.x=player.x+800*Math.cos(this.angle);
  this.y=player.y+800*Math.sin(this.angle);
  this.radius=Math.random()*30+10;
  this.width=2;
  this.color='gray';
  this.speed=Math.random()*3+1;
  this.move=function(){
    this.x-=this.speed*Math.cos(this.angle);
    this.y-=this.speed*Math.sin(this.angle);
  }
  this.isDead=function(){
    if (this.x+this.radius>canvas.width+800) return true;
    if (this.x-this.radius<-800) return true;
    if (this.y+this.radius>canvas.height+800) return true;
    if (this.y-this.radius<-800) return true;
  }
  this.hp=this.radius;
}
//end game objects

//init and run
var gameTimer; //used to end the game and start it again
function init(){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  document.addEventListener('mousedown',function(e) {
    e.preventDefault();
    keysDown['mouse']=true;
  },false);
  document.addEventListener('mouseup',function(e) {
    delete keysDown['mouse'];
  },false);
  document.addEventListener('mousemove',function(e) {
    mousePos = getMouseCoords(e);
  },false);
  document.addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
  },false);
  document.addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
  },false)
  setup();
}
function setup(){
  points=0;
  player.x=250;
  player.y=250;
  bullets=[];
  enemies=[];
}
function run(){
  window.clearInterval(gameTimer);
  update();
  render();
  //temporary dumb loop set to non-ensured 60fps
  gameTimer = setInterval(function(){
    update();
    render();
    increaseCount(); //fps
  },16.7)
}
function stop(){
  window.clearInterval(gameTimer);
  document.getElementById("points").innerHTML='points:'+0;
  gameTimer = setInterval(function(){
    ctx.font="18px arial";
    ctx.fillStyle="white";
    ctx.fillText("Game Over! Your score:"+points,150,240);
    ctx.fillText("Press enter to restart!",170,260);
    if(keysDown[13]){
      setup();
      run();
    }
  },16.7)
}
//end init and run

/*fps stuff*/
var count=0;
function increaseCount(){
  count++;
}
setInterval(function(){
  document.getElementById("count").innerHTML='fps:'+count;
  count=0;
  enemies.push(new Enemy());
},1000);
/*end fps stuff*/

//logic
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
function update(){
  mouseChaser.update(mousePos.x,mousePos.y);
  if('mouse' in keysDown){
    bullets.push(new Bullet(mousePos.x,mousePos.y));
  }
  if (KEY_UP in keysDown) { 
    if (player.y-player.radius>=0) {
      player.y -= player.speed;
    }
  }
  if (KEY_DOWN in keysDown) { 
    if (player.y+player.radius<=canvas.height) {
      player.y += player.speed;
    }
  }
  if (KEY_LEFT in keysDown) { 
    if (player.x-player.radius >= 0) {
      player.x -= player.speed;
    }
  }
  if (KEY_RIGHT in keysDown) { 
    if (player.x+player.radius <= canvas.width) {
      player.x += player.speed;
    }
  }
  var deadBullets=[];
  for(var i=bullets.length-1;i>=0;i--){
    bullets[i].move();
    for (var j=0;j<enemies.length;j++) {
      if(Math.sqrt(Math.pow(enemies[j].x-bullets[i].x,2)+Math.pow(enemies[j].y-bullets[i].y,2))<enemies[j].radius+bullets[i].radius){
        deadBullets.push(i);
        enemies[j].hp--;
        if(enemies[j].hp<=0){
          points+=Math.floor(enemies[j].radius);
          document.getElementById("points").innerHTML='points:'+points;
          enemies.splice(j,1);
        }
        break;
      }
    };
    if (bullets[i].isDead()){
      bullets.splice(i,1);
    }
  }
  for (var i=0;i<deadBullets.length; i++) {
    bullets.splice(deadBullets[i],1);
  };
  for(var i=enemies.length-1;i>=0;i--){
    enemies[i].move();
    if(Math.sqrt(Math.pow(enemies[i].x-player.x,2)+Math.pow(enemies[i].y-player.y,2))<enemies[i].radius+player.radius){
      stop();
      break;
    }
    if (enemies[i].isDead()){
      enemies.splice(i,1);
    }
  }
}
//end logic

//rendering
function render(){
  renderBackground();
  renderPlayer();
  renderMouse();
  renderBullets();
  renderEnemies();
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
function renderMouse(){
  ctx.beginPath();
  ctx.arc(mouseChaser.x, mouseChaser.y, mouseChaser.radius, 0, 2*Math.PI, false);
  ctx.lineWidth = mouseChaser.width;
  ctx.strokeStyle = mouseChaser.color;
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
function renderEnemies(){
  for (var i=0;i<enemies.length;i++){
    ctx.beginPath();
    ctx.arc(enemies[i].x, enemies[i].y, enemies[i].radius, 0, 2*Math.PI, false);
    ctx.lineWidth = enemies[i].width;
    ctx.strokeStyle = enemies[i].color;
    ctx.stroke();
    ctx.closePath();
  }
}
//end rendering

//helper functions
/**
* returns key value pair for mouse coordinates
* x and y offset are from the edge of the screen
* y is 10 because our css margin is 10, x is auto so we do half canvas - half document
* not sure if this is compatible on all browsers
**/
function getMouseCoords(event) {
  var x,y;
  x=(event.pageX);
  y=(event.pageY);
  x+=258-window.innerWidth/2;
  y-=10;
  return {"x": x, "y": y};
}