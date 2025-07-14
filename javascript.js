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

let minion = {
    img : null,
    x : minionX,
    y: minionY,
    width : minionWidth,
    height : minionHeight
}

let velocityX = 0; //logic of the game
let velocityY = 0; //the jump speed
let initialVelocityY = -8;
let gravity = 0.4;

let platformArray = [];
let platformWidth = 58;
let platformHeight = 14;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver=false;
let highScore=0;
//before 

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
    if(gameOver){
        return;
    }
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

    if(minion.y > board.height){
        if(score>highScore){
            highScore=score;
        }
        gameOver = true;
    }
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

    //clearing platforms and adding new as minion goes up
    while(platformArray.length > 0 && platformArray[0].y >=  boardHeight + 100){
        platformArray.shift(); 
        newPlatforms();
    }

    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if(gameOver){
        context.fillText("GAME OVER : Press 'Space' to Restart" , boardWidth/7, boardHeight*7/8);
        // context.fillText("Your score: " +score, boardWidth/7, boardHeight*7/8+20);
        context.fillText("High Score: "+highScore , boardWidth/3, boardHeight*7/8+40);
        // context.textAlign = "center";
    }
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
    else if(e.key == "ArrowUp"){
        velocityY = -6;
    }
    else if(e.code == "Space" && gameOver){
     minion = {
    img : minionRight,
    x : minionX,
    y: minionY,
    width : minionWidth,
    height : minionHeight
}
        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatform();
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

function updateScore(){
    let points = Math.floor(30*Math.random());
    if(velocityY < 0){ //that is when it goes up , velocity < 0 means neg and neg is up
        maxScore += points;
        if(score < maxScore){
            score = maxScore;
        }
    }
    else if(velocityY >= 0){
        maxScore -= points;
    }
}