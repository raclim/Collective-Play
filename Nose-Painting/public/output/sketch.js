//PoseNet with Webcam credit: https://ml5js.org/docs/posenet-webcam
// Open and connect output socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

//Keep track of users
let users = {};

let img;

//keep track of new users
let newUserColor = false;

// Create new user in the middle
function createNewUser(id) {
  users[id] = {
    pos: { 
        x : width, 
        y : height
      },
    r : 220,
    g : 220,
    b : 220,
    alpha: 20
  }
}

function preload() {
  img = loadImage('https://cdn.glitch.com/02f24d86-e780-41ad-90b0-0f55ae75e03d%2FColoringpage.jpg?1550632830376'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //img
  // image(img, 0, 0);
  // img.hide();
  image(img, 0, 0, img.width, img.height);

  // Listen for nose data from server
  socket.on('nose', function (message) {
    console.log(message);
    let id = message.id;
    let data = message.data;

    // let vel = { x: data.x/10, y: data.y/10 };

    // Create new user
    if (!(id in users)) {
      createNewUser(id);
    }
    if (!(id in users) && users.length > 0) {
      newUserColor = true;
    }

    // Update user data
    // Location of nose
    let user = users[id];
    // Current position becomes previous position
    user.pos.x = data.x;
    user.pos.y = data.y;
    user.r = data.r;
    user.g = data.g;
    user.b = data.b;
    user.alpha = data.alpha;

    blip(user.pos.x, user.pos.y, user.r, user.g, user.b, user.alpha);
  });
}
function blip(userX, userY,r,g,b,alpha) {
  noStroke();
  fill(r,g,b,alpha);
  ellipse(userX, userY, 20, 20);
}
