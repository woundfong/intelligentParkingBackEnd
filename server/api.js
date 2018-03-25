const express = require('express');
const router = express.Router();

const app = express();

const generateParkingLot = require('../public/javascripts/generateParkingLot');
const generateParkingUnit = require('../public/javascripts/generateParkingUnit');
const userService = require('./user-service/userApi');
const parkingService = require('./parking-service/parkingApi');
const authService = require('./auth-service/authApi');
const mapService = require('./map-service/mapApi');
const walletService = require('./wallet-service/walletApi');

app.use('/user', userService);
app.use('/parking', parkingService);
app.use('/auth', authService);
app.use('/map', mapService);
app.use('/wallet', walletService);

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

