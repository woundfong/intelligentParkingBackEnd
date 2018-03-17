const express = require('express');
let app = express();
let sendVerificationCode = require('./sendVerificationCode');
let checkVerificationCode = require('./checkVerificationCode');
let login = require('./login');

app.use('/sendVerificationCode', sendVerificationCode);
app.use('/checkVerificationCode', checkVerificationCode);
app.use('/login', login);
app.use('/', (req, res)=> {
    res.send('auth api works');
})
module.exports = app;