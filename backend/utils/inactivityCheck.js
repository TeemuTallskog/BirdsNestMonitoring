let inactiveSince = null;

const twentyMinutesAgo = () => {
    return Date.now() - 1200000;
}

const serverHasBeenInactive = (clientsCount) => {
    if(clientsCount > 0){
        inactiveSince = null;
        return false;
    }
    if(inactiveSince === null){
        console.log("Pausing API calls in 20 minutes");
        inactiveSince = Date.now();
    }

    return (twentyMinutesAgo() > inactiveSince);

}

module.exports = serverHasBeenInactive;