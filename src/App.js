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
        const socket = io.connect('http://localhost:' + PORT);
        socket.on('connect', ()=>console.log(socket.id));
        socket.on('drones', (data)=>{setDrones(data); console.log(data)});
        socket.on('violations',(data)=>{setViolators(data); console.log(data)});
        return()=>{
            socket.off('connect');
            socket.off('drones');
            socket.off('violations');
        }
    }, []);
  return (
    <div className="App">
        <Radar drones={drones}/>
        <ViolatorsList violators={violators}/>
    </div>
  );
}

export default App;
