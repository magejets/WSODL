//Sound Class
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.setAttribute("loop","loop");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}   
//Block Class
function block(x,y,width,height,material){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.material = material;

    this.draw = function(){
        ctx.beginPath();
        ctx.rect(x-cameraX,y-cameraY,width,height);
        if(x==0){
            ctx.fillStyle = "#003363";
        }else if(material == "solid"){
            ctx.fillStyle = "#eec666";
        }else if(material == "glass"){
            ctx.fillStyle = "#ddeeff";
        }
        ctx.fill();
        ctx.closePath();
    }
}

function skiier(x,y,width,height,skiLength,color){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.skiLength = skiLength;
    this.color = color;
    this.speedY = 0;
    this.speedx = 1;
    this.jumpKey = 0;
    this.jumpSpeed = 10;
    this.dead = false;

    this.draw = function(){
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.width,this.height);
        ctx.rect((this.x+(this.width/2))-(this.skiLength/2),(this.y+this.height)-5,this.skiLength,5);
        ctx.moveTo(this.x+this.width,this.y+this.height/2);
        ctx.lineTo(stage.width,stage.height/3);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    this.walk = function(speed){
        this.x += speed;
        var slope;
        for(var i=0; i<map.length;i++){
            var p = map[i];
            slope = 0;
            while(slope < 8 && collisionDetection(this,p) == true){
                this.y -= 1;
                slope +=1;
            }
                
            if(slope >= 8){
                this.x -= speed;
                this.y += slope;
                this.kill();
            }
        }
    }

    this.touchGround = function(up){
        this.falling += 1;
        for(var i =0; i<map.length;i++){
            var p = map[i];
        
            while(collisionDetection(this,p)==true){
                if(up){
                    this.y += .5
                }else {
                    this.y -= .5; //this number must be equal to what speedY changes each time
                    this.falling = 0;
                }
                this.speedY = 0;

            }
        }
    }

    this.kill = function(){
        attempts += 1;
        started = false;
        this.dead = true;
    }
}

function Boomerang(x,y){
    this.x = x;
    this.y = y;
    this.width = 15;
    this.height = 15;
    this.direction = 1;
    this.speed = 5;
    this.moving = false;

    this.draw = function (){
        ctx.beginPath();
        if(Math.floor(this.x)%2 == 0){
            ctx.rect(this.x-cameraX,this.y-cameraY,5,15);
            ctx.rect(this.x-cameraX,(this.y-cameraY)+10,15,5);
        }else{
            ctx.rect(this.x-cameraX,this.y-cameraY,5,15);
            ctx.rect(this.x-cameraX,this.y-cameraY,15,5);
        }
        ctx.fillStyle = "#f96717";
        ctx.fill();
        ctx.closePath();
    }
    this.update = function(skiier){
        if(this.moving){
            this.x += this.direction*this.speed;
            if(Math.abs(this.x-realX)>150){
                this.direction*=-1;
            }
            if(Math.abs(this.x-realX)<15 && this.direction == -1){
                this.direction = 1;
                this.moving = false;
            }
            if(this.direction == -1){
                if(this.y<realY){
                    this.y+=1;
                }else{
                    this.y-=1;
                }
            }
        }else{
            this.x = realX;
            this.y = realY;
        }
    }
}

function Button(x,y,width,height,text,textColor,color,bufferSize,result){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = "Restart";
    this.color = color;
    this.textColor = textColor;
    this.bufferSize = bufferSize;
    this.pressed = false;

    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x,this.y,this.width,this.height);
        ctx.fill();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.font = "15px Comic Sans MS";
        ctx.fillStyle = this.textColor;
        //console.log(this.text);
        ctx.fillText(text,this.x+this.bufferSize*2,this.y+this.bufferSize*2,this.width-2*this.bufferSize);
        ctx.closePath();

        
    }

    this.result = function(){
        result();
    }
}
