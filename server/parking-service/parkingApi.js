const express = require('express');
var app = express();
var getParkinglots = require('./getParkinglots');
var getParkingUnits = require('./getParkingUnits');
var addParking = require('./addParking');
app.use('/getParkinglots', getParkinglots);
app.use('/getParkingUnits', getParkingUnits);
app.use('/add', addParking);
app.use('/', (req, res)=> {
    res.send('parking api works');
})
module.exports = app;