const express = require('express');
const router = express.Router();

var app = express();

var generateParkingLot = require('../public/javascripts/generateParkingLot');
var generateParkingUnit = require('../public/javascripts/generateParkingUnit');
var userService = require('./user-service/userApi');
var parkingService = require('./parking-service/parkingApi');
var authService = require('./auth-service/authApi')
var mapService = require('./map-service/mapApi')

app.use('/user', userService);
app.use('/parking', parkingService);
app.use('/auth', authService);
app.use('/map', mapService);

app.use('/generateParkingLot', (req, res)=>{
    generateParkingLot();
    res.send('done');
})
app.use('/generateParkingUnit', (req, res)=>{
    generateParkingUnit();
    res.json('done')
})
app.use('/', (req, res)=> {
    res.send('api works');
})

module.exports = app;

