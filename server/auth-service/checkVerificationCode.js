let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');
let getDate = require('../public/getDate');

let sql = "select * from msg_codes where phone_num = ? and code = ? and start_time > ?";

router.get('/', (req, res, next) => {
    let validMinsAgoDate = getDate.getFormatValidDate("yyyy-MM-dd hh:mm:ss");
    console.log(validMinsAgoDate)
    let phoneNum = req.query.phoneNum, code = req.query.code;
    let result = {};
    mySqlQuery(sql, [phoneNum, code, validMinsAgoDate], (err, queryResult) => {
        if(err) {
            result.code = "0";
            result.errMsg = "服务器异常";
            res.json(result);
            return false;
        }
        result.code = "200";
        result.errMsg = "check successfully";
        console.log(queryResult)
        if(queryResult.length > 0) {
            result.isValid = true;
        } else {
            result.isValid = false;
        }
        res.json(result);
    });
})
module.exports = router;