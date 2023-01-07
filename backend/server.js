require('dotenv').config();
const mongooseInit = require('./utils/mongooseInit');
const fetchDroneData = require('./utils/droneLogger');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const Violation = require("./models/Violation");
const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const path = require('path');
const serverHasBeenInactive = require('./utils/inactivityCheck');

app.use(express.static(path.join(__dirname,'..','build')));

app.get('/', function (req, res){
    res.sendFile(path.join(__dirname,'..','build', 'index.html'));
});

const io = socketIo(server, {
    cors: {
        origin: "*",
    }
});

io.on('connection',(socket)=>{
    console.log('client connected: ', socket.id);
    socket.join('drone-data');
    socket.on('disconnect', (reason)=>console.log("client disconnected " + reason));
})

server.listen(PORT, err=>{
    if(err) console.log(err);
    console.log('Server running on Port ', PORT);
})

mongooseInit();

let isPaused = false;

/**
 * Collects drone data from the api every 2 seconds, analyzes it emits the data to the client along with the violators list.
 * If no client has connected to the server for 20 minutes the API calls and data collection will be paused.
 */
setInterval( async () =>{
    if(!isPaused && serverHasBeenInactive(io.eio.clientsCount)){
        isPaused = true;
        console.log("API calls were paused due to inactivity");
    }
    if(io.eio.clientsCount > 0){
        isPaused = false;
    }
    if(!isPaused){
        emitDroneData(await fetchDroneData()); //Fetches drone data from the API, analyzes it for violations and emits the drone data to client.
        emitViolators(await Violation.find().sort({createdAt: -1})); //Fetches a list of violations and sorts it by date, then emits it to client.
    }
}, 2000)


function emitDroneData(droneData){
    io.to('drone-data').emit('drones', droneData);
}
function emitViolators(violations){
    io.to('drone-data').emit('violations', violations);
}

module.exports = {emitDroneData, emitViolators};