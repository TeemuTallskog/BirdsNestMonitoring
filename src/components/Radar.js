import {useEffect, useRef} from "react";

const Radar = props =>{
    const canvasRef = useRef(null);

    const draw = (ctx,drones) => {
        ctx.clearRect(0,0, 500,500);
        ctx.strokeStyle = '#FF0000'
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(250, 250, 100, 0, 2*Math.PI);
        ctx.stroke();
        if(props.drones) {
            props.drones.forEach((drone) => {
                drawDrone(drone, ctx);
            });
        }
    }

    const drawDrone = (drone,ctx) => {
        ctx.fillStyle = getDistanceToBirdsNest(drone) > 100 ? '#00FF00' : '#FF0000';
        ctx.beginPath();
        ctx.arc(drone.positionX / 1000, drone.positionY / 1000, 5, 0, 2*Math.PI);
        ctx.fill();
        drawDroneSerial(drone, ctx);
    }

    const drawDroneSerial = (drone, ctx) =>{
        const fontSize = 20, fontFamily = 'Arial', color = 'black', textAlign = 'center', textBaseline = 'top';
        ctx.beginPath();
        ctx.font = fontSize + 'px ' + fontFamily;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillStyle = color;
        ctx.fillText(drone.serialNumber, drone.positionX/1000, (drone.positionY/1000) + 15);
        ctx.stroke();
    }

    const getDistanceToBirdsNest = (drone) => {
        const center = 250000;
        const x = drone.positionX;
        const y = drone.positionY;
        return Math.sqrt((x-center)**2+(y-center)**2) / 1000;
    }


    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d');
        draw(context);
    }, [props])

    return (
        <div style={{margin: '25px'}}>
            <canvas style={{border: '5px solid'}} ref={canvasRef} width={500} height={500} {...props}/>
            <figcaption>Drone radar around the birds nest</figcaption>
            </div>
            )
}

export default Radar;