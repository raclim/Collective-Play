// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
}); 

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

// Keep track of queue
let queue = [];
let q = -1;
let current;

let goalLocX, goalLocY;
setup();

function setup(){
  goalLocX = 720/2 + Math.random() * (225 - (-225)) + (-225);
  goalLocY = 720/1.85 + Math.random() * (275 - (-275)) + (-275);
  console.log("setup just happened");
  console.log(goalLocX, goalLocY);
}

// setInterval(()=>{console.log(goalLocX, goalLocY);}, 5000);

// Listen for individual clients to connect
io.sockets.on('connection',
  // Callback function on connection
  // Comes back with a socket object
  function (socket) {
    
    
    console.log("We have a new client: " + socket.id);
 
    // Add socket to queue
    queue.push(socket);
  
    io.sockets.emit('random', {x:goalLocX, y:goalLocY});

    // Kick off queue as soon as there's 1 person in line
    if (q < 0 && queue.length > 1) {
      console.log('first next called');
      next();  
    }
    // Listen for add messages
    socket.on('add', function (data) {
      // Data comes in as whatever was sent, including objects
      //console.log("Received: 'message' " + data);
      let d = dist(data.x, data.y, goalLocX, goalLocY);
      console.log(d);
      
      if (d < 25) {
        console.log('YOU WIN!!!!!!');
        socket.emit('hit', data);
        io.sockets.emit('lose', data);
        setup(); 
      } else {
        // Send it to all clients, including this one
        io.sockets.emit('add', data);
      }
      
    });

    // Listen for remove messages
    socket.on('remove', function (data) {
      // Data comes in as whatever was sent, including objects
      //console.log("Received: 'message' " + data);

      // Send it to all clients, including this one
      io.sockets.emit('remove', data);
    });

    // Ready for next
    socket.on('next', function () {
      next();
    });

    // Listen for this client to disconnect
    // Tell everyone client has disconnected
    socket.on('disconnect', function() {
      io.sockets.emit('disconnected', socket.id);
      console.log("Disconnect client: " + socket.id);
      // If current client disconnected, move onto next client
      if (socket === current) next();
 
      // Remove socket from queue
      for(let s = 0; s < queue.length; s++) {
        if(queue[s].id == socket.id) {
          queue.splice(s, 1); 
        }
      }
    });
  });

// Get next client
function next() {
  console.log('next');
  // Move to next person in line
  q++;
  q %= queue.length;
  console.log("NEXT UP: ", q);

  current = queue[q];
  current.emit('go');
}

function dist(x1, y1, x2, y2) {
  let a = x1 - x2;
  let b = y1 - y2;

  let c = Math.sqrt( a*a + b*b );
  return c;
}