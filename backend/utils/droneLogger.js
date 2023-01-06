const axios  = require("axios");
const {XMLParser} = require('fast-xml-parser');
const Violation  = require( "../models/Violation");
const parser = new XMLParser();

const fetchDroneData = async() => {
//'http://assignments.reaktor.com/birdnest/drones'
    return axios.get('http://assignments.reaktor.com/birdnest/drones', {
        "Content-Type": "application/xml; charset=utf-8",
    }).then(res => {
        let obj = parser.parse(res.data);
        checkForViolations(obj.report.capture.drone);
        return(obj.report.capture.drone);
    })
}

const getDistanceToBirdsNest = (drone) => {
    const center = 250000;
    const x = drone.positionX;
    const y = drone.positionY;
    return Math.sqrt((x-center)**2+(y-center)**2) / 1000;
}

const checkForViolations = async (drones) => {
    await drones.forEach((drone) => {
        if(getDistanceToBirdsNest(drone) < 100){
            Violation.countDocuments({serialNumber: drone.serialNumber}, async function (err, count) {
                if(err){
                    console.log(err + "count doc");
                    return;
                }
                if (count > 0) {
                    await checkAndUpdateViolation(drone);
                } else {
                    const pilotInfo = await fetchPilot(drone);
                    if(!pilotInfo){
                        pilotInfo.firstName = "missing";
                        pilotInfo.lastName = "missing";
                        pilotInfo.email = "missing";
                        pilotInfo.phoneNumber = "missing";
                        pilotInfo.pilotId = "missing";
                    }
                        const pilot = new Violation({
                            pilotId: pilotInfo.pilotId,
                            serialNumber: drone.serialNumber,
                            firstName: pilotInfo.firstName,
                            lastName: pilotInfo.lastName,
                            email: pilotInfo.email,
                            phone: pilotInfo.phoneNumber,
                            x: drone.positionX,
                            y: drone.positionY,
                            distance: getDistanceToBirdsNest(drone)
                        });
                        pilot.save();
                }
            })
        }
    })
}

const fetchPilot = async (drone) =>{
    return axios.get('http://assignments.reaktor.com/birdnest/pilots/' + drone.serialNumber, {
        "Content-Type": "application/json; charset=utf-8",
    }).then(res => {
        return res.data;
    }).catch(error => {
        console.log(error + "Fetch pilot err");
        return null;
    });
}

const checkAndUpdateViolation = async (drone) =>{
    const oldDrone = await Violation.findOne({serialNumber: drone.serialNumber}).catch(console.error);
    if(oldDrone.distance > getDistanceToBirdsNest(drone)){
        Violation.updateOne({serialNumber: drone.serialNumber},
            {
                distance: getDistanceToBirdsNest(drone),
                x: drone.positionX,
                y: drone.positionY,
                createdAt: Date.now()
            }, (err, docs) => {
                if(err) console.log(err);
            });
    }else{
        Violation.updateOne({serialNumber: drone.serialNumber},
            {
                createdAt: Date.now()
            }, (err, docs) => {
                if(err) console.log(err);
            });
    }
}

module.exports = fetchDroneData;