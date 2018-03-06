var express = require('express');
var router = express.Router();
var mySqlQuery = require('./mySqlQuery');

var SQL = {
    query_users: "select * from users where user_id = ?",
    query_master: "select * from master where user_id = ?"
}

router.get('/', (req, res, next) => {
    var result = {};
    var account = req.query.account;
    mySqlQuery(SQL.query_users, [account], (err, queryUserResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = '0';
            res.json(result);
            throw err;
        }
        result.userInfo = queryUserResult[0];
        mySqlQuery(SQL.query_master, [account], (err, queryMasterResult) => {
            if(err) {
                result.errMsg = "服务器异常";
                result.code = '0';
                res.json(result);
                throw err;
            }
            if(queryMasterResult.length <= 0) {
                result.role = 'not_master';
            }else {
                result.role = 'master';
                result.master_id = queryMasterResult[0].master_id;
            }
            result.errMsg = "query successfully";
            result.code = '200';
            res.json(result);
        });
    });
    
})

module.exports = router;