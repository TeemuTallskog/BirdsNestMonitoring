import './App.css';
import ViolatorsList from "./components/ViolatorsList";
import Radar from "./components/Radar";
import { io } from 'socket.io-client';
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    const [drones, setDrones] = useState([]);
    const [violators, setViolators] = useState([]);
    const PORT = process.env.PORT || 8080;
    useEffect(()=>{
        const socket = io();
        socket.on('connect', ()=>console.log(socket.id));
        socket.on('drones', (data)=>{setDrones(data)});
        socket.on('violations',(data)=>{setViolators(data)});
        return()=>{
            socket.off('connect');
            socket.off('drones');
            socket.off('violations');
        }
    }, []);
  return (
    <div className="App">
        <div className='credits' style={{textAlign: 'left', marginLeft: '15px', marginTop: '15px'}}>
            <h5>Author: Teemu Tallskog</h5>
            <h8>Assignment: <a href='https://assignments.reaktor.com/birdnest/'>https://assignments.reaktor.com/birdnest/</a></h8>
            <h8>Source code: <a href='https://github.com/TeemuTallskog/BirdsNestMonitoring'>https://github.com/TeemuTallskog/BirdsNestMonitoring</a></h8>
            <p>Data collection will be stopped if the server doesn't receive any connections for 20 minutes</p>
        </div>
        <Radar drones={drones}/>
        <ViolatorsList violators={violators}/>
    </div>
  );
}

export default App;
