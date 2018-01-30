const express = require('express');
const router = express.Router();

var app = express();
var getParkinglots = require('./getParkinglots');
var guide = require('./guideRoad');

app.use('/getParkinglots', getParkinglots);
app.use('/guide', guide);

app.use('/', (req, res)=> {
    res.send('api works');
})

module.exports = app;

