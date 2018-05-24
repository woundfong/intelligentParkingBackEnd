const express = require('express');
const qs = require('querystring');  
const setting = require('../../config/setting');
const router = express.Router();
const my_http = require('../public/myHttp');
const session = require('express-session');
const mySqlQuery = require('../public/mySqlQuery');
const execTrans = require('../public/execTransaction');
function checkUser(id) {
    let sql = "select * from users where user_id = ?";
    mySqlQuery(sql, [id], (err, queryResult) => {
        if(err) {
            return -1;
        }
        let res = 0;
        if(queryResult.length > 0) {
            res = 1;
        } else {
            res = 0;
        }
        return res;
    })
}
router.post('/', (req, resp, next) => {
    let param = req.body;
    param.appid = setting.appid;
    param.secret = setting.secret;
    param.grant_type = setting.grant_type;
    let options = {
        hostname: setting.loginApiHostname,
        path: "/sns/jscode2session?" + qs.stringify(param),
        method: 'GET',
        port: 443
    };
    let result = {};
    my_http.https_get(options, (res) => {
        let openid = res.data.openid;
        let sql = "select * from users where user_id = ?";
        mySqlQuery(sql, [openid], (err, queryResult) => {
            let ifExist = 0;
            if(err) {
                ifExist = -1;
            }
            if(queryResult.length > 0) {
                ifExist = 1;
            } else {
                ifExist = 0;
            }
            console.log("ifExist------" + ifExist);
            if(ifExist == -1) {
                result.code = "0";
                result.errMsg = "服务器异常";
                resp.json(result);
                throw err;
                return false;
            } else if(ifExist == 0) {
                let sqlEntities = [
                    {
                        sql: "insert into users(user_id) values(?)",
                        params: [openid]
                    },
                    {
                        sql: "insert into wallet(balance,deposit,user_id) values(0,0,?)",
                        params: [openid]
                    }
                ];
                execTrans(sqlEntities, (err, queryResult) => {
                    if(err) {
                        result.errMsg = "服务器异常";
                        result.code = "0";
                    } else {
                        result.errMsg = "register successfully";
                        result.code = "200";
                        result.user_id = openid;
                    }
                    resp.json(result);
                })
            } else {
                req.session.iparkUser = openid;
                resp.json({
                    code: "200",
                    user_id: openid
                });
            }
        })
    });
});

module.exports = router;