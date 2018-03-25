const express = require('express');
const app = express();
const getParkinglots = require('./getParkinglots');
const getParkingUnits = require('./getParkingUnits');
const addParking = require('./addParking');
const getApplying = require('./getApplying');
const getOccupiedInfo = require('./getOccupiedInfo');
const getUserOccupying = require('./getUserOccupying');
const park = require('./park')
app.use('/getParkinglots', getParkinglots);
app.use('/getParkingUnits', getParkingUnits);
app.use('/add', addParking);
app.use('/getApplying', getApplying);
app.use('/getOccupiedInfo', getOccupiedInfo);
app.use('/getUserOccupying', getUserOccupying);
app.use('/park', park);
app.use('/', (req, res)=> {
    res.send('parking api works');
})
module.exports = app;