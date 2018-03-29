let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

let sql = "select user_id, phone from users where user_id = ?";

router.get('/', (req, res, next) => {
    let result = {};
    mySqlQuery(sql, [req.query.user_id], (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        result.errMsg = "query successfully";
        result.code = "200";
        result.publicInfo = queryResult[0];
        res.json(result);
    })
})
module.exports = router;