const express = require('express');
var app = express();
var applyToBeMaster = require('./applyToBeMaster');
var getUserAllInfo = require('./getUserAllInfo');
var getUserPublicInfo = require('./getUserPublicInfo');
var getLicensePlates = require('./getLicensePlates');
var updateUserInfo = require('./updateUserInfo');
app.use('/applyMaster', applyToBeMaster);
app.use('/getUserAllInfo', getUserAllInfo);
app.use('/getUserPublicInfo', getUserPublicInfo);
app.use('/getLicensePlates', getLicensePlates);
app.use('/updateUserInfo', updateUserInfo);
app.use('/', (req, res)=> {
    res.send('user api works');
})
module.exports = app;