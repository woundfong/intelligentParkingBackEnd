var express = require('express');
var router = express.Router();
var mySqlQuery = require('./mySqlQuery');

var SQL = "update users set";

router.get('/', (req, res, next) => {
    var result = {};
    var account = req.query.account;
    if(typeof req.query.phoneNum !== "undefined") {
        SQL = "update users set phone = '" + req.query.phoneNum + "' where user_id = '" + account + "'";
    }
    if(typeof req.query.license_plate !== "undefined") {
        SQL = "insert into license_plate(license_plate, owner) values('" + req.query.license_plate + "','" + account + "')";
    }
    console.log(SQL)
    mySqlQuery(SQL, [], (err, queryResult) => {
        if(err) {
            result.code = '0';
            result.errMsg = "服务器异常";
            res.json(result);
            throw err;
        }
        result.code = '200';
        result.errMsg = "update successfully";
        res.json(result);
    });
})
module.exports = router;