import Table from 'react-bootstrap/Table';
import moment from 'moment';

function ViolatorsList(props){

    const generateTable = props.violators && props.violators.map((item) => {
        return(
            <tbody>
                <tr>
                    <td>{moment(item.createdAt).fromNow()}</td>
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
            <h1>NDZ Violators</h1>
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
            </div>
        </div>
    )
}

export default ViolatorsList;