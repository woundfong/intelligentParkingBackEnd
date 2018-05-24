const express = require('express');
const app = express();
const applyToBeOwner = require('./applyToBeOwner');
const getUserAllInfo = require('./getUserAllInfo');
const getUserPublicInfo = require('./getUserPublicInfo');
const getLicensePlates = require('./getLicensePlates');
const updateUserInfo = require('./updateUserInfo');
const getUserOccupying = require('./getUserOccupying');
const reservation = require('./reservation');
const history = require('./history');
const getNotices = require('./getNotices');
app.use('/applyOwner', applyToBeOwner);
app.use('/getUserAllInfo', getUserAllInfo);
app.use('/getUserPublicInfo', getUserPublicInfo);
app.use('/getLicensePlates', getLicensePlates);
app.use('/updateUserInfo', updateUserInfo);
app.use('/getUserOccupying', getUserOccupying);
app.use('/reservation', reservation);
app.use('/getUserHistory', history);
app.use('/getNotices', getNotices);
app.use('/', (req, res)=> {
    res.send('user api works');
})
module.exports = app;