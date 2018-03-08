var express = require('express');
var router = express.Router();
var mySqlQuery = require('./mySqlQuery');

var SQL = "select * from license_plate where owner = ?";

router.get('/', (req, res, next) => {
    var result = {};
    var owner = req.query.owner;
    mySqlQuery(SQL, [owner], (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = '0';
            res.json(result);
            throw err;
        }
        result.licensePlates = queryResult;
        result.errMsg = "query successfully";
        result.code = '200';
        res.json(result);
    })
})

module.exports = router;