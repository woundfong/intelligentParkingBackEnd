const execTrans = require('../public/execTransaction');

function register(user_id, resp) {
    let result = {};
    let sqlEntities = [
        {
            sql: "insert into users(user_id) values(?)",
            params: [user_id]
        },
        {
            sql: "insert into wallet(balance,deposit,user_id) values(0,0,?)",
            params: [user_id]
        }
    ];
    execTrans(sqlEntities, (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
        } else {
            result.errMsg = "register successfully";
            result.code = "200";
            result.user_id = user_id;
        }
        resp.json(result);
    })
}
module.exports = register;