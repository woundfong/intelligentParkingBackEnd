const express = require('express');
const app = express();
const applyToBeMaster = require('./applyToBeMaster');
const getUserAllInfo = require('./getUserAllInfo');
const getUserPublicInfo = require('./getUserPublicInfo');
const getLicensePlates = require('./getLicensePlates');
const updateUserInfo = require('./updateUserInfo');
const getUserOccupying = require('./getUserOccupying');
const getUserAppointing = require('./getUserAppointing');
const history = require('./history');
const getNotices = require('./getNotices');
const mLogin = require('./mLogin');
app.use('/applyMaster', applyToBeMaster);
app.use('/getUserAllInfo', getUserAllInfo);
app.use('/getUserPublicInfo', getUserPublicInfo);
app.use('/getLicensePlates', getLicensePlates);
app.use('/updateUserInfo', updateUserInfo);
app.use('/getUserOccupying', getUserOccupying);
app.use('/getUserAppointing', getUserAppointing);
app.use('/getUserHistory', history);
app.use('/getNotices', getNotices);
app.use('/mLogin', mLogin);
app.use('/', (req, res)=> {
    res.send('user api works');
})
module.exports = app;