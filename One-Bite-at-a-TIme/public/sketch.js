// Open and connect input socket
let socket = io(); 

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

// Is it my turn?
let myTurn = false;
// Canvas element
let cnv;
// Margin;
let m = 10;
let instruction = '';
let img;
let winImg;
let loseImg;

let bites = [];
let hitLoc;
let bite;

let won = false;
let winText;

function preload(){
  img = loadImage('https://cdn.glitch.com/d0f7e564-0699-4c76-81a9-3fddeb3b97f2%2Fcupcake.png?1554321553453');
  winImg = loadImage('https://cdn.glitch.com/d0f7e564-0699-4c76-81a9-3fddeb3b97f2%2FImage%201.png?1554681099834');
  loseImg = loadImage('https://cdn.glitch.com/d0f7e564-0699-4c76-81a9-3fddeb3b97f2%2FImage%202.png?1554681313819');
}

function setup() {
  // background(255);
  imageMode(CENTER); 

  
  cnv = createCanvas(720, 720);
  
  // Disable canvas by deafult
  // cnv.addClass('disabled');
  // Text styling
  textAlign(LEFT, TOP);
  textSize(32);

  // Draw string once connected
  drawString();

  socket.on('random', function(data){ 
    hitLoc = data;
  });
  
  // Listen for my turn
  socket.on('go', function() {
    myTurn = true;
    // Update instructions on screen
    drawString();
  });

  // Listen for changes to text
  socket.on('add', function(data) {
    // Update string
    bites.push(data);
    if(bites.length>3){
      bites.splice(0,1);
    }
    // Update string on screen
    drawString();
  });

  socket.on('hit', function(data) {
    won = true;
    // hits.push(data);
  });
  
  socket.on('lose', function(data) {
    if (won == false) {
       winText = 'You lose!!!!!!!!!!!!';
    } else {
       winText = 'You win!!!!!!!!!!!!!';
    
    } 
    // hits.push(data);
  });
   
}

function draw() {
  background(255);
  image(img, width/2,height/2, img.width/1.5, img.height/1.6);
  stroke(0);
  fill(0);
  text(instruction, m, m);
  
  stroke(0);
  noFill();
  ellipse(mouseX, mouseY, 50, 50);
  
  
  // fill(255,0,255);
  // if (hitLoc != null) {
  //  console.log(hitLoc);
  //  ellipse(hitLoc.x,hitLoc.y, 50,50);
  // }
  
    
  fill(255);
  noStroke();
  for (let i = 0; i < bites.length; i++) {
    ellipse(bites[i].x,bites[i].y, 50,50);
  }
  
  // fill(0);
  // ellipse(hitLoc.x, hitLoc.y, 50,50);

    if (won == true) {
      image(winImg, width/2,height/2, img.width/1.5, img.height/1.6);
    }

    if (won == false && winText != null) {
      image(loseImg, width/2,height/2, img.width/1.5, img.height/1.6);
    }

    if (winText != null) { 
      text(winText, width/2, width/2);
    }

}


// Draw string, character by character
function drawString() {
    if (myTurn == false) {
    instruction = 'wait...';
  }
  if (myTurn == true) {
    instruction = 'bite!';
  }
}

// Only listen for ASCII keystrokes
function mousePressed() {
  // Ignore if it's not your turn
  if (!myTurn) return;

  // Send data
  socket.emit('add', {x:mouseX, y:mouseY});
  myTurn = false;
  next();
}

function next(){
  socket.emit('next');
}
