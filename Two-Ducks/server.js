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

//according to https://socket.io/docs/rooms-and-namespaces/
// not sure what adapter is, since we're not using redis?
// but I get that this is supposed to be a running list of all rooms
let rooms = io.sockets.adapter.rooms;
let roomNum = 0; 
//number of users that are in each game
let numPartners = 2;

//for scores
let duckRanks = [];

//initialize with an empty room to try and get the server crash bug solved
// rooms = {0: 0};

//going to try and move duckNames, lean data, and cake/poo to a new Game object
//hopefully will resolve any issues with using the rooms socket thing
let games = [];
let maxGames = 12;
//intialzing w/ empty elements to try and fix joined bug
for (let n in maxGames){
  games[n] = [];
}
class Game { //function, not class because hoisting?
  constructor(room){
    this.room = room; //should have array of Games
    this.duckNames = [];
    this.duckLeans = [];
    this.cakes = [];
    this.poops = [];
  }
  //initializes all the scrolling objects and score
  start(){
    
  }
  //sends a score message once
  sendScore(){
    
  }
  //empties all the object arrays
  reset(){
    
  }
  
  
}


// Shared screen with leaderboard stats
var screen = io.of('/screen');
  // Listen for the leaderboards to connect
  screen.on('connection', function (socket) {
  console.log('Leaderboard connected: ' + socket.id);

  // Listen for this output client to disconnect
  socket.on('disconnect', function () {
    console.log("Leaderboard has disconnected " + socket.id);
  });
});

// Default connection for players, just plain url, no namespace
let ducks = io.of('/');
// Listen for players to connect
ducks.on('connection', function (socket) {
  console.log('New Duck! Quacking from: ' + socket.id);
  
  socket.on('joined', function(data){
    socket.name = data.name; //need?
    socket.lean = data.lean;
    joinRoom(socket);
    
    //can move all the below to data to fix async error?
    // let room = socket.room;
    // let players = Game[room].duckNames;
    // let players = Object.keys(rooms[socket.room]['ducks']);
    // console.log(players);
    // let partners = {
    //   names: players
    // }
    //send partner event message
    // ducks.to(socket.room).emit('partner', partners);
    console.log(rooms);
    console.log(games);
  });
  
  socket.on('ready', function(){
    //originally wanted to highlight player name to show one was ready, but for now, if one presses, will trigger start
    // socket.to(socket.room).emit('ready');
    socket.to(socket.room).emit('start game'); //not sending to both players?
  });

  
  // Listen for data messages
  socket.on('data', function (data) {
    let room = socket.room;
    // let name = data.name;
    //new
    let players = games[room].duckNames;
    // let partners = {
    //   names: players
    // }
    //old
    let ourLean = 0;
    // console.log(games[room]);
    for (let i = games[room].duckNames.length -1; i >= 0; i--){
      // for (let j = games.duckLeans.length -1; j >= 0; j--){
      if (data.name == games[room].duckNames[i]){ 
        games[room].duckLeans[i] = data.lean; //updating individual lean
      // }
        //issue if people use same name... but fine if not...
      }
    }
    for (let leans in games[room].duckLeans){
      ourLean += games[room].duckLeans[leans];
    }
    // rooms[room]['ducks'][name] = data.lean; //updating individual value
    // let ourLean = 0;
    // for (let duck in rooms[room]['ducks']){
    //   ourLean += rooms[room]['ducks'][duck]; //so not strings but values...
    // }
    
    // Wrap up data in message
    // let leanMsg = {
    //   lean: ourLean
    // }
    // console.log(data.lean);
    // console.log(leanMsg.lean);

    // Send lean update to ducks in that room
    // ducks.to(room).emit('lean update', leanMsg);
    //new data event
  
    let updatedData = { //need to update on sketch
      names: players,
      lean: ourLean
    }
    ducks.to(room).emit('update', updatedData);
  });
  
  socket.on('cakes', function (cakeData) {
    let room = socket.room;
    let name = cakeData.name;
    rooms[room]['ducks'][name] = cakeData.cakeX; //updating individual value
    // rooms[room]['ducks'][name] = cakeData.cakeY; //updating individual value
    // rooms[room]['ducks'][name] = cakeData.cakeSpeed; //updating individual value
    // rooms[room]['ducks'][name] = cakeData.cakeHit; //updating individual value
    let cakeX = cakeX;
    // let cakeY = cakeY;
    for (let duck in rooms[room]['ducks']){
      cakeX += rooms[room]['ducks'][duck]; //so not strings but values...
      // cakeY += rooms[room]['ducks'][duck]; //so not strings but values...
    }
    // Wrap up data in message
    let cakeMsg = {
      newCakeX: cakeX,
      // newCakeY: cakeY
    }
    console.log(cakeData.cakeX);
    // console.log(leanMsg.lean);

    // Send cake update to ducks in that room
    ducks.to(room).emit('cake update', cakeMsg);
    //send lean to screen
  // }
  });

  //when they lose
  socket.on('end game', function(count){
    console.log('new score');
    let room = socket.room;
    // let nameArray = Object.keys(rooms[room]['ducks']); //need to make string...
    // console.log(nameArray);
    let duckNames ="";
    for (let i = 0; i < games[room].duckNames.length; i++){
      duckNames += (games[room].duckNames[i] + " "); //if error can split up onto separate lines
      
      // if (nameArray[i] != 'zero'){
        // duckNames += (nameArray[i] + " "); //if error can split up onto separate lines
      // }
    }
    // console.log(duckNames);
    let final = {
      duckNames: duckNames,
      points: count //from event**
    }
    console.log(final);
    let repeat = false;
    for (let i = duckRanks.length - 1; i >= 0; i--){ //because there's going to be a duplicate msg every time, no?
      if (duckRanks[i] == final){
        repeat = true;
      }
    }
    if (!repeat){
      duckRanks.push(final);
      duckRanks.sort(function (a, b) {
        return b.points - a.points;
      });
      screen.emit('new score', duckRanks); //right?
    }    
  });
  
  
  // Listen for this player to disconnect
  // Tell all players this player disconnected
  socket.on('disconnect', function () {
    console.log("Duck has flown away: " + socket.id);
    //to remove the name from the room
    let name = socket.name;
    let room = socket.room;
    
    for (let duck in games[room].duckNames){
      if (games[room].duckNames[duck] == name){
        games[room].duckNames.splice(duck, 1);
      }
    }
    
  // *****weirdest thing, if then only duck leaves, the rooms object disappears.... ******
    // delete rooms[room]['ducks'][name];
    
  });
});


function joinRoom(socket) {
//ahhh got it, so each "room" is an array of the socket ids of its occupants
//if you find a room with 0 or 1 users, you join it.
  for (let r in rooms) {
    let room = rooms[r];
    if (room.isPrivate) {
      if (room.length < numPartners) {
        addSocketToRoom(socket, r);
        return;
      }
    }
  }

  //so this is only if there are no rooms? since roomNum is 0? hmm....
  addSocketToRoom(socket, roomNum);
  //ahh, and it'll repeat and create new rooms in the case that the only rooms that exist have 2 people already?
  // oh because this is server, so roomNum is globalllllll duh
  roomNum++;
}
//so this is the actual function that adds the socket to the room
function addSocketToRoom(socket, r) {
  socket.join(r);
  socket.room = r;
  let duckName = socket.name;
  if (rooms[r].isPrivate != true){ //important b/c technically not false
    // if (games[r] == undefined){
    let game = new Game(r);
    games[r] = game;
    // }
  }
  games[r].duckNames.push(duckName);
  rooms[r].isPrivate = true;
  /*
  //console.log(Object.keys(rooms[r])); //wtf, how is Room {} the value of r?
  if (rooms[r]['ducks'] == undefined){
    rooms[r]['ducks'] = {'zero': 0};
  }
  rooms[r]['ducks'][duckName] = socket.lean; //to store lean
  // rooms[r]['ducks'] = {duckName: socket.lean}; //why doesn't this work?
  */
}