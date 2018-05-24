let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');
const execTrans = require('../public/execTransaction');
router.post('/', (req, res) => {
    let account = req.body.account;
    let result = {};
    let parkingUnitId = req.body.parkingUnitId, remark = req.body.remark,
        status = req.body.status, open_time = req.body.open_time,
        price = req.body.price, grant = req.body.grant;
    let sql1 = "update parking_unit set remark = ?,status = ?,open_time = ?,grantList = ? where parking_unit_id = ?",
        params1 = [remark, status, open_time, grant, parkingUnitId],
        sql2 = "update price set price = ? where price_id in (select price_id from parking_unit where parking_unit_id = ?)",
        params2 = [price, parkingUnitId];
    let sqlEntities = [
        {
            sql: sql1,
            params: params1
        },
        {
            sql: sql2,
            params: params2
        }
    ];
    execTrans(sqlEntities, (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        result.errMsg = "update successfully";
        result.code = "200";
        res.json(result);
    })
    // mySqlQuery(sql, [account], (err, queryResult) => {
    //     if(err) {
    //         result.errMsg = "服务器异常";
    //         result.code = "0";
    //         res.json(result);
    //         return false;
    //     }
    //     result.errMsg = "query successfully";
    //     result.code = "200";
    //     result.insertId = queryResult.insertId;
    //     res.json(result);
    // })
})
module.exports = router;