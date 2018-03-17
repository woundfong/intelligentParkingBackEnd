const express = require('express');
var app = express();
var guide = require('./guideRoad');
var location = require('./location');

app.use('/guide', guide);
app.use('/location', location);
app.use('/', (req, res)=> {
    res.send('map api works');
})
module.exports = app;