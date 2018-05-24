const express = require('express');
const app = express();
const sendVerificationCode = require('./sendVerificationCode');
const checkVerificationCode = require('./checkVerificationCode');

app.use('/sendVerificationCode', sendVerificationCode);
app.use('/checkVerificationCode', checkVerificationCode);

app.use('/', (req, res)=> {
    res.send('auth api works');
})
module.exports = app;