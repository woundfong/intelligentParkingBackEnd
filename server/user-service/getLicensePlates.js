let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

let sql = "select license_plate from license_plate where owner = ?";

router.get('/', (req, res, next) => {
    let result = {};
    let owner = req.query.owner;
    mySqlQuery(sql, [owner], (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        result.licensePlates = queryResult;
        result.errMsg = "query successfully";
        result.code = "200";
        res.json(result);
    })
})

module.exports = router;