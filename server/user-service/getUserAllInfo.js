let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

let sql = "select u.user_id,u.phone,u.wallet_id,m.master_id,w.balance,w.deposit " 
          + "from users u left join master m on u.user_id = m.user_id "
          + "left join wallet w on u.wallet_id = w.wallet_id where u.user_id = ?;"
        + "select license_plate from license_plate where owner = ?";
// {
//     query_users: "select * from users where user_id = ?",
//     query_master: "select * from master where user_id = ?"
// }

router.get('/', (req, res, next) => {
    let result = {};
    let account = req.query.account;
    mySqlQuery(sql, [account, account], (err, queryUserResults) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        result.userInfo = queryUserResults[0][0];
        result.userInfo.licensePlates = queryUserResults[1];
        // if(queryUserResult[0].master_id) {
        //     result.userInfo.role = 'not_master';
        // }else {
        //     result.userInfo.role = 'master';
        //     result.userInfo.master_id = queryUserResults[1][0].master_id;
        // }
        result.errMsg = "query successfully";
        result.code = "200";
        res.json(result);
    })
    
})

module.exports = router;