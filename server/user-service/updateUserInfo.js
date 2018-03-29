let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');
let sql = "";
router.post('/', (req, res, next) => {
    let result = {}, param = [];
    let account = req.body.account;
    if(typeof req.body.phoneNum !== "undefined") {
        sql = "update users set phone = ? where user_id = ?";
        param = [req.body.phoneNum, account];
    }
    if(typeof req.body.license_plate !== "undefined") {
        sql = "insert into license_plate(license_plate, owner) values(?, ?)";
        param = [req.body.license_plate, account];
    }
    mySqlQuery(sql, param, (err, queryResult) => {
        if(err) {
            result.code = "0";
            result.errMsg = "服务器异常";
            res.json(result);
            return false;
        }
        result.code = "200";
        result.errMsg = "update successfully";
        res.json(result);
    });
})
module.exports = router;