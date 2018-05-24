let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

let sql = "insert into owner(user_id) values(?)";

router.post('/', (req, res) => {
    let account = req.body.account;
    let result = {};
    mySqlQuery(sql, [account], (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        result.errMsg = "query successfully";
        result.code = "200";
        result.insertId = queryResult.insertId;
        res.json(result);
    })
})
module.exports = router;