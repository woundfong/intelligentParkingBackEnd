const express = require('express');
const app = express();
const getParkinglots = require('./getParkinglots');
const getParkingUnits = require('./getParkingUnits');
const addParking = require('./addParking');
const getApplying = require('./getApplying');
const checkIfCanPark = require('./checkIfCanPark');
const park = require('./park');
const appoint = require('./appoint');
const endParking = require('./endParking');
const readPayment = require('./readPayment');
const getParkingPrice = require('./getParkingPrice');
const cancelAppoint = require('./cancelAppoint');
app.use('/getParkinglots', getParkinglots);
app.use('/getParkingUnits', getParkingUnits);
app.use('/add', addParking);
app.use('/getApplying', getApplying);
app.use('/check', checkIfCanPark);
app.use('/park', park);
app.use('/appoint', appoint);
app.use('/end', endParking);
app.use('/read', readPayment);
app.use('/getParkingPrice', getParkingPrice);
app.use('/cancelAppoint', cancelAppoint);
app.use('/', (req, res)=> {
    res.send('parking api works');
})
module.exports = app;