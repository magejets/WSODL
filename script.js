/****************************************
*      COPYRIGHT 2019 MAGE J LEWIS      *
****************************************/

//Canvas setup
var stage = document.getElementById("stage");
var ctx = stage.getContext("2d");
//ctx.canvas.width = window.innerWidth;

//initialize variables
var time;
var music = new sound("backgroundTunes.mp3");
var started = false;
var ended = false;
var map = [];
var lastBlock;
var player = new skiier(0,0,0,0,"#FFFFFF");
var boomerang;
var gravity;
var cameraX;
var cameraY;
var realX = stage.width/4;
var realY = stage.height/2;
var highScore = 0;
var buttons = [];
var attempts = 0;

//Keyboard vars
var up = false;
var down = false;
var left = false;
var right = false;
var space = false;



//Resets the vars for every time you die
function resetVars(){
    if(time > highScore){
        highScore = time;
    }
    time = 0;
    map = [];  
    player = new skiier(stage.width/4,stage.height/2,20,30,50,"#770099");
    boomerang = new Boomerang(-30,-30);
    music.sound.currentTime = 0;
    music.sound.play();
    started = true;
    ended = false;
    map.push(new block(0,280,500,500,"solid"));
    map.push(new block(500,280,100,500,"solid"));
    lastBlock = map[1];
    player.jumpSpeed = 30;
    gravity = 0.5;
    cameraX = 0;
    cameraY = 0;
}

//Shows the screen between deaths
function startScreen(){
    //draw all the stuff
    ctx.clearRect(0,0,stage.width,stage.height);
    ctx.beginPath();
    ctx.rect(stage.width/2,stage.height/2,40,60);
    ctx.rect((stage.width/2+(40/2))-(100/2),(stage.height/2+60)-5,100,5);
    ctx.moveTo(stage.width/2+40,stage.height/2+60/2);
    ctx.lineTo(stage.width,stage.height/3);
    ctx.strokeStyle = "#770099";
    ctx.stroke();
    ctx.fillStyle = "#770099";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(0,stage.height/2+60,stage.width,stage.height);
    ctx.fillStyle = "#eec666";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    if(highScore = 0){
        ctx.fillStyle = "#ffffff";
        ctx.fillText("WSODL", stage.width/2, 70);
        ctx.fill();
    }
    ctx.closePath();
    var message = "Start";
    if(attempts == 0){
        message = "Start";
    }
    if(attempts>0){
        message = "Restart";
    }
    buttons[0] = new Button(stage.width/2-50,stage.height/2-100,90,30, message, "#FFFFFF", "#61084f", 10 , resetVars );
    buttons[0].draw();
}

startScreen();

//Keyboard functions
function keyDownHandler(e){
    if(e.key == "Up" || e.key == "ArrowUp" || e.key == "w"){
        up = true;
    }
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d"){
        right = true;
    }
    if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a"){
        left = true;
    }
    if(e.key == " "){
        space = true;
    }
}
function keyUpHandler(e){
    if(e.key == "Up" || e.key == "ArrowUp" || e.key == "w"){
        up = false;
    }
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d"){
        right = false;
    }
    if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a"){
        left = false;
    }
    if(e.key == " " /*space bar*/){
        space = false;
    }
}

//Takes in two objects with width, height, x and y and determines if they overlap
function collisionDetection(body1,body2){
    return body1.x+body1.width > body2.x-cameraX && body1.x < body2.x+body2.width-cameraX && 
           body1.y+body1.height > body2.y-cameraY && body1.y < body2.y+body2.height-cameraY
}

//Returns a random int from the min to the max. Includes min but not max
function randInt(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

//returns a color for the sky based on how long the player has been going
function getSkyColor(t){
    var x = 60*((t/60)-Math.floor(t/60)); //x = time of day. t = total time since start of round
    var light = ((-17/60)*x*x)+17*x;
    var color = "rgb("+light/3+","+light/1.2+","+light+")";
    ctx.beginPath();
    ctx.rect(x*8,320-light*1.2,50,50);
    ctx.fillStyle = "#f4c22e";
    ctx.fill();
    ctx.closePath();
    document.body.style.background = color;
    return color;
}

//draws the ground
function drawMap(){
    for(var i= 0; i<map.length; i++){
        map[i].draw();
    }
}

//Detects when the boomerang collides with a block and responds accordingly
function boomyCollisions(){
    for(var i = 0; i < map.length; i++){
        if(boomerang.x+boomerang.width-cameraX > map[i].x-cameraX && boomerang.x-cameraX < map[i].x+map[i].width-cameraX && 
           boomerang.y+boomerang.height-cameraY > map[i].y-cameraY && boomerang.y-cameraY < map[i].y+map[i].height-cameraY){
            boomerang.direction = -1;
            if(map[i].material == "glass"){
                map.splice(i,1);
            }
        }
    }
}


//Generates the random terrain
function makeMap(){
    var maxX = lastBlock.x+lastBlock.width
    while(realX+window.innerWidth>maxX){
        var xBase = lastBlock.x+lastBlock.width;
        var x = xBase+randInt(1,50+Math.floor(time/100));
        var yMax = ((player.jumpSpeed*player.jumpSpeed)/(4*gravity))*(0.1+time/500);
        var y = lastBlock.y+randInt(-1*yMax,.5*yMax);
        var width = randInt(25,200);
        var height = 500;
        var material = "solid";
        map.push(new block(x,y,width,height,material));
        if(randInt(1,15)==10){
            map.push(new block(x+((width)/2),y-100,20,100,"glass"));
        }
        lastBlock = new block(x,y,width,height,material);
        maxX = lastBlock.x+lastBlock.width
    }
}

//Moves the camera based on where the player is
function updateCamera(x,y){
    cameraX += x-stage.width/4;
    cameraY += y-stage.height/2;
}

//Main Game loop
function main(){
if(started){    //Don't start until the start button is clicked
    ctx.clearRect(0,0,stage.width,stage.height);
    document.getElementById("stage").style.background = getSkyColor(time);
    ctx.font = "17px Ariel";
    ctx.fillStyle = "#FFFFff";
    ctx.fillText("Time: "+Math.floor(time),10,20);
    ctx.fillText("High Score: "+Math.floor(highScore),window.innerWidth-180,20);
    time +=0.01;
    makeMap();
    player.speedX = 2;
    if(Math.abs(player.speedX)>0.2){
        player.walk(player.speedX);
    }
    if(up == true){
        if(player.falling<3 && player.jumpKey==0){
            player.speedY = 10;
            player.jumpKey = 1;
        }
    } else {
        player.jumpKey = 0;
    }
    player.y -= player.speedY;
    if(player.speedY<4 || up== true){
        player.speedY -= gravity;
    } else {
        player.speedY -= gravity*2;
    }
    if(right && !boomerang.moving){
        boomerang.moving = true;
    }
    player.touchGround(player.speedY>0);
    updateCamera(player.x,player.y);
    player.x = stage.width/4;
    player.y = stage.height/2;
    realX = cameraX+player.x;
    realY = cameraY+player.y;
    boomerang.update(player);
    boomyCollisions();
    boomerang.draw();
    player.draw();
    drawMap();
}else if(player.dead){
    ctx.clearRect(0,0,stage.width,stage.height);
    ctx.font = "69px Ariel";
    ctx.fillStyle = "#ff0000";
    ctx.fillText("YOU DIED!", 50,stage.height/2);      
    music.sound.pause();
    startScreen();
}
}

//Keyboard event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Function to get the mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

//Binding the click event on the canvas
stage.addEventListener('click', function(evt) {
    var mousePos = getMousePos(stage, evt);

    for(var i=0; i<buttons.length; i++){
        if (isInside(mousePos,buttons[i])) {
            buttons[i].result();
        }  
    }
}, false);

//Make the game loop loop
setInterval(main,10);
