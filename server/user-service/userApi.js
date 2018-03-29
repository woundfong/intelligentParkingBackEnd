const express = require('express');
const app = express();
const applyToBeMaster = require('./applyToBeMaster');
const getUserAllInfo = require('./getUserAllInfo');
const getUserPublicInfo = require('./getUserPublicInfo');
const getLicensePlates = require('./getLicensePlates');
const updateUserInfo = require('./updateUserInfo');
const getUserOccupying = require('./getUserOccupying');
const getUserHistory = require('./getUserHistory');
app.use('/applyMaster', applyToBeMaster);
app.use('/getUserAllInfo', getUserAllInfo);
app.use('/getUserPublicInfo', getUserPublicInfo);
app.use('/getLicensePlates', getLicensePlates);
app.use('/updateUserInfo', updateUserInfo);
app.use('/getUserOccupying', getUserOccupying);
app.use('/getUserHistory', getUserHistory);
app.use('/', (req, res)=> {
    res.send('user api works');
})
module.exports = app;