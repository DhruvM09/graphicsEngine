const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
document.addEventListener("keydown",HandleInput)
document.addEventListener("keyup" , HandleKeyup)

const WIDTH = 800;
const HEIGHT = 600;
const boxLen = 40;
let fov = Math.PI/2;
const PlayerSize = 10;
let position = [400 , 300];
let velocity = [0,0];
let moveright = false;
let moveup = false;
let movedown = false;
let moveleft = false;
let angle = Math.PI/2;
let dtheta = 1;
let level = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

];
function clear(){
let backgroundColor = "grey";
ctx.fillStyle = backgroundColor;
ctx.fillRect(0,0,WIDTH,HEIGHT);
}

function castRay(rayAngle){
    let x  = position[0];
    let y = position[1]; 
    let dx = Math.cos(rayAngle);
    let dy = Math.sin(rayAngle);
    let i = 0;
     while(level[Math.floor(y/boxLen)][Math.floor(x/boxLen)] === 0){
        y  += -dy * 1;
        x  += dx * 1;
     }
     
    let distance = Math.sqrt((x-position[0])**2 + (y - position[1]) ** 2);
    //fisheye fix
    let diff = Math.abs(angle - rayAngle);
    distance *= Math.cos(diff);
     
    let wallHeight = 30000/distance;
    //  ctx.beginPath();
    //   ctx.moveTo(position[0]/8, position[1]/8);
    //   ctx.lineTo(x/8 ,y/8 )
    //   ctx.stroke();

    //wall height cap
     if(wallHeight > HEIGHT) wallHeight = HEIGHT;

    return {distance , wallHeight};
}
function drawWall(i , wallHeight , sliceWidth , rayAngle){
    for(let j = 0 ; j  < wallHeight;j++){
        let yPosition  = Math.floor(300 - wallHeight/2+j);
     
                ctx.fillStyle = "darkgreen";

            ctx.fillRect(i*sliceWidth , yPosition, sliceWidth,1);
        
         
    }
}
function raycasting(){
    const rays = 200;

    const sliceWidth = WIDTH/rays;
    const angleStep = fov/rays;

    //walls
    for(let i = 0 ; i < rays; i++){
        const rayAngle  = angle - (fov/2) +  i * angleStep;
        const {distance , wallHeight} = castRay(rayAngle);
        drawWall(rays - i , wallHeight,sliceWidth , rayAngle);
    }
}
function drawLevel(){
    
    for(let i = 0; i < 15;i++){
        for(let j = 0 ; j < 20;j++){
            if(level[i][j] == 1){
            ctx.fillStyle = "white"
            ctx.fillRect(boxLen/10 * j,boxLen/8 * i,boxLen/8,boxLen/8);         
            }
        }
    }
}
function HandleKeyup(event){
    if (event.keyCode === 87) { //w
            moveup = false;
        } else if (event.keyCode === 83) { //s
            movedown = false;
        } else if (event.keyCode === 65) { //a
            moveleft = false;
        } else if (event.keyCode === 68) { //d
            moveright = false;
        }


}
function HandleInput(event){
    if (event.keyCode === 87) { //w
            moveup = true;
        } else if (event.keyCode === 83) { //s
            movedown = true;
        } else if (event.keyCode === 65) { //a
            moveleft = true;
        } else if (event.keyCode === 68) { //d
            moveright = true;
        }
    if(event.keyCode === 74){
        angle += 0.1;
    }if(event.keyCode === 75){
        angle -= 0.1;
    }

}
function move(){
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);
    if(position[0] > WIDTH - PlayerSize){
        position[0] = WIDTH - PlayerSize;
    }
    if(position[0] < 0 + PlayerSize){
        position[0] = PlayerSize;
    }

    // if(moveup && !movedown) velocity[1] = -1;
    // if(movedown && !moveup) velocity[1] = 1;
    // if(moveleft && !moveright)velocity[0] = -1;
    // if(moveright && !moveleft)velocity[0] = 1;
    // if(!moveup && !movedown)velocity[1] = 0; 
    // if(!moveright && !moveleft)velocity[0] = 0;
    if(moveup){
        position[0] += dx;
        position[1] -= dy;
    }if(movedown){
        position[0] -= dx;
        position[1] += dy;
    }
    // position[0] += velocity[0];
    // position[1] += velocity[1]; 
}
function drawPlayer(){
    ctx.fillStyle = "blue";
    ctx.fillRect(position[0]/8, position[1]/8, PlayerSize/2,PlayerSize/2);
}
function draw(){
    clear();
    drawLevel();
    drawPlayer();
    raycasting()
}


function init(){
    window.requestAnimationFrame(update)
}

init();
function update(){
    draw();
    move();
   
window.requestAnimationFrame(update)
}