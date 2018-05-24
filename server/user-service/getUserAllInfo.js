let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

let sql = "select u.user_id,u.phone,u.licensePlates,o.owner_id,w.wallet_id,w.balance,w.deposit " 
          + "from users u left join owner o on u.user_id = o.user_id "
          + "left join wallet w on u.user_id = w.user_id where u.user_id = ?";
// {
//     query_users: "select * from users where user_id = ?",
//     query_owner: "select * from owner where user_id = ?"
// }

router.get('/', (req, res, next) => {
    let result = {};
    let account = req.query.account;
    mySqlQuery(sql, [account, account], (err, queryUserResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        result.userInfo = queryUserResult[0];
        // if(queryUserResult[0].owner_id) {
        //     result.userInfo.role = 'not_owner';
        // }else {
        //     result.userInfo.role = 'owner';
        //     result.userInfo.owner_id = queryUserResults[1][0].owner_id;
        // }
        result.errMsg = "query successfully";
        result.code = "200";
        res.json(result);
    })
    
})

module.exports = router;