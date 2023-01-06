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
let prevClientCount = 1;
let pauseInTime = null;
setInterval(async ()=>{
    if(isPaused){
        if(io.eio.clientsCount !== 0){
            isPaused = false;
        }
    }
    else if(prevClientCount>0 && io.eio.clientsCount === 0){
        console.log("Pausing in 10");
        pauseInTime = Date.now() + 1200000;
        prevClientCount = 0;
    }
    else if(pauseInTime !== null && io.eio.clientsCount === 0){
        if(Date.now() > pauseInTime){
            console.log("Stopping api calls due to inactivity");
            isPaused = true;
        }
        prevClientCount = io.eio.clientsCount;
    }else{
        prevClientCount = io.eio.clientsCount;
        pauseInTime = null;
        emitDroneData(await fetchDroneData());
        emitViolators(await Violation.find().sort({createdAt: -1}));
    }
}, 2000)

/**
 * emits recieved drone data to client
 * @param droneData
 */
function emitDroneData(droneData){
    io.to('drone-data').emit('drones', droneData);
}
function emitViolators(violations){
    io.to('drone-data').emit('violations', violations);
}

module.exports = {emitDroneData, emitViolators};