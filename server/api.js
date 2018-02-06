const express = require('express');
const router = express.Router();

var app = express();
var getParkinglots = require('./getParkinglots');
var getParkingUnits = require('./getParkingUnits');
var guide = require('./guideRoad');
var location = require('./location');
var login = require('./login');
var generate = require('../public/javascripts/generateParking')

app.use('/getParkinglots', getParkinglots);
app.use('/getParkingUnits', getParkingUnits);
app.use('/guide', guide);
app.use('/location', location);
app.use('/login', login);
app.use('/generate', (req, res)=>{
    generate();
    res.send('done');
})

app.use('/', (req, res)=> {
    res.send('api works');
})

module.exports = app;

