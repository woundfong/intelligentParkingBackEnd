let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

let sql = {
    query_users: "select * from users where user_id = ?",
    query_master: "select * from master where user_id = ?"
}

router.get('/', (req, res, next) => {
    let result = {};
    let account = req.query.account;
    mySqlQuery(sql.query_users + ";" + sql.query_master, [account, account], (err, queryUserResults) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = '0';
            res.json(result);
            throw err;
        }
        result.userInfo = queryUserResults[0][0];
        if(queryUserResults[1].length <= 0) {
            result.userInfo.role = 'not_master';
        }else {
            result.userInfo.role = 'master';
            result.userInfo.master_id = queryUserResults[1][0].master_id;
        }
        result.errMsg = "query successfully";
        result.code = '200';
        res.json(result);
    })
    
})

module.exports = router;