const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const violationsSchema = new Schema({
    serialNumber: String,
    pilotId: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    x: String,
    y: String,
    distance: String,
    createdAt: {
        type: Date, expires: 600, default: Date.now
    }
});

const Violation = mongoose.model('Violation', violationsSchema);

module.exports = Violation;