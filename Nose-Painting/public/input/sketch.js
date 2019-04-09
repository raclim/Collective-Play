/PoseNet with Webcam credit: https://ml5js.org/docs/posenet-webcam
// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

let video;
let poseNet;
let poses = [];
let alpha;
let r, g, b;
let img;

function preload() {
  img = loadImage('https://cdn.glitch.com/02f24d86-e780-41ad-90b0-0f55ae75e03d%2FColoringpage.jpg?1550632830376'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  
  //img
  //image(img, 0, 0);
  // img.hide();

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // // Hide the video element, and just show the canvas
  video.hide();
  //image(img, 0, 0, img.width*0.75, img.height*0.75);
  
  alpha = random(30, 50);
  r = random(255);
  g = random(255);
  b = random(255);
}

function modelReady() {
  console.log('Model Loaded!');
}

// function preload() {
//   // preload() runs once
//   img = loadImage('Coloringpage.jpg');
// }

function draw() {
  //image(video, 0, 0, width, height);
  //background(255);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints

    let pose = poses[i].pose;
    console.log(pose);
    let nose;
    //let rightWrist;

    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        switch (j) {
          case 0:
            nose = keypoint;
            break;
        }

        if (nose) {
          let nx = map(nose.position.x,0,width,width,0);
          let ny = nose.position.y;
          fill(r,g,b,alpha);
          noStroke();
          ellipse(nx,ny, 20, 20);
          socket.emit('nose',{x: nx, y: ny, r:r, g:g, b:b, alpha:alpha});
        }
      }
    }
  }
}
