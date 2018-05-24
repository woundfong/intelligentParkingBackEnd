const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');
const execTrans = require('../public/execTransaction');
const getDate = require('../public/getDate');
const mysql = require('mysql');
const db = require('../../config/db');
const pool = mysql.createPool(db.mysql);
const async = require("async");
const end = require("./end");
const probabilityOfTicket = 0.1, probabilityOfCoupon = 0.9;

router.post('/', (req, res, next) => {
    end(req, (result) => {
        res.json(result)
    })
})
module.exports = router;