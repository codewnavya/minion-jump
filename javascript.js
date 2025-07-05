let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

let minionWidth = 60;
let minionHeight = 65;
let minionRight;
let minionLeft;
let minionX = boardWidth/2 - minionWidth/2;
let minionY = boardHeight*7/8 - minionHeight;

let velocityX = 0; //logic of the game
let velocityY = 0; //the jump speed
let initialVelocityY = -8;
let gravity = 0.4;

let platformArray = [];
let platformWidth = 58;
let platformHeight = 15;
let platformImg;

let minion = {
    img : null,
    x : minionX,
    y: minionY,
    width : minionWidth,
    height : minionHeight
}


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    // context.fillStyle = "green";
    // context.fillRect(minion.x, minion.y, minion.width, minion.height);

    minionRight = new Image();
    minionRight.src = "./minion-right.png";
    minion.img = minionRight;
    minionRight.onload = function(){
    context.drawImage(minion.img, minion.x, minion.y, minion.width, minion.height);
    }
    minionLeft = new Image();
    minionLeft.src = "./minion-left.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    velocityY = initialVelocityY;
    placePlatform();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveMinion);
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width,board.height);
 
    minion.x += velocityX;
    if(minion.x > boardWidth){
        minion.x = 0;
    }
    else if(minion.x + minion.width < 0){
        minion.x = boardWidth;
    }

    velocityY += gravity;
    minion.y += velocityY;
    context.drawImage(minion.img, minion.x, minion.y, minion.width, minion.height);

    //platforms
    for(let i=0; i<platformArray.length; i++){
        let platform = platformArray[i];

        if(velocityY<0 && minion.y < boardHeight*3/4){
            platform.y -= initialVelocityY;
        }
        if(detect(minion, platform) && velocityY>= 0){
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img, platform.x,platform.y,platform.width,platform.height);
    }

    // while(platformArray.length > 0 && platformArray[0].y >=  )
}

function moveMinion(e){
    if(e.key== "ArrowRight" || e.key == "KeyD"){
        velocityX = 4;
        minion.img = minionRight; 
    }
    else if(e.key == "ArrowLeft" || e.key == "KeyA"){
        velocityX = -4;
        minion.img = minionLeft;
    }
}

function placePlatform(){
    platformArray = [];

    //starting platforms
    let platform = {
        img: platformImg,
        x: boardWidth/2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight,
    }

    platformArray.push(platform);

    //  platform = {
    //     img: platformImg,
    //     x: boardWidth/2,
    //     y: boardHeight - 200,
    //     width: platformWidth,
    //     height: platformHeight,
    // }

    // platformArray.push(platform);

    for(let i=0; i<6; i++){
        let randomPlats = Math.floor(Math.random() * boardWidth * 3/4);
           let platform = {
        img: platformImg,
        x: randomPlats,
        y: boardHeight - 75*i - 150,
        width: platformWidth,
        height: platformHeight,
    }

    platformArray.push(platform);
    }
}

function newPlatforms(){
    let randomPlats = Math.floor(Math.random() * boardWidth * 3/4);
           let platform = {
        img: platformImg,
        x: randomPlats,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight,
    }

    platformArray.push(platform);
    }

function detect(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}