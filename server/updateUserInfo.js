var express = require('express');
var router = express.Router();
var mySqlQuery = require('./mySqlQuery');

var SQL = "update users set";

router.get('/', (req, res, next) => {
    var result = {};
    var account = req.query.account;
    if(typeof req.query.phoneNum !== "undefined") {
        SQL += " phone = '" + req.query.phoneNum + "'";
    }
    if(typeof req.query.license !== "undefined") {
        SQL += " license = '" + req.query.license + "'";
    }
    SQL += " where user_id = '" + account + "'";
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