import Table from 'react-bootstrap/Table';

function ViolatorsList(props){

    const elapsedTime = (date) =>{
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 60;
        if(interval > 1){
            if(interval < 2){
                return "a minute ago"
            }
            return Math.floor(interval) + " minutes ago"
        }
        return Math.floor(seconds) + " seconds ago";
    }

    const generateTable = props.violators && props.violators.map((item) => {
        return(
            <tbody>
                <tr>
                    <td>{elapsedTime(item.createdAt)}</td>
                    <td>{parseFloat(item.distance).toFixed(2)} Meters</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.pilotId}</td>
                    <td>{item.serialNumber}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                </tr>
            </tbody>
        )
    });

    return (
        <div>
            <h1>NDZ Violations in the past 10 minutes</h1>
            <div style={{overflowY: 'scroll'}}>
                <Table striped bordered hover variant="dark">
                    <thead>
                    <tr>
                        <th>Time since</th>
                        <th>Distance from nest</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Pilot ID</th>
                        <th>Drone Serial number</th>
                        <th>Email</th>
                        <th>Phone number</th>
                </tr>
                </thead>
                    {generateTable}
            </Table>
                {props.violators.length > 0 ? <></> : <h4>Connecting...</h4>}
            </div>
        </div>
    )
}

export default ViolatorsList;