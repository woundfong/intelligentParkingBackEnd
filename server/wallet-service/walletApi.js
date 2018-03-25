const express = require('express');
const app = express();
const getBalance = require('./getBalance');
const getCoupon = require('./getCoupon');
const recharge = require('./recharge');
app.use('/balance', getBalance);
app.use('/getCoupon', getCoupon);
app.use('/recharge', recharge);
app.use('/', (req, res)=> {
    res.send('wallet api works');
})
module.exports = app;