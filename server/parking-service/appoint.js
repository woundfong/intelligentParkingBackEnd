const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
    let result = {};
    let sql = "select appointment_id from appointment_table where user_id = ?;" + 
              "select appointment_id from appointment_table where appoint_parking_unit_id = ?";
    let params = [req.body.user, req.body.parkingUnitId];
    mySqlQuery(sql, params, (err, queryResults) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        if(queryResults[0].length > 0) {
            result.errMsg = "您已有其他预约";
            result.code = "0";
            result.json(result);
        } else if(queryResults[1].length > 0) {
            result.errMsg = "抱歉，已有其他人预约了此车位";
            result.code = "0";
            result.json(result);
        } else {
            sql = "insert into appointment_table(start_time,estimated_end_time,appoint_parking_unit_id,user_id,deposit,arrived) " +
                  "values(?,?,?,?,?,0)";
            let now = new Date();
            params = [now, req.body.endTime, req.body.parkingUnitId, req.body.user, req.body.deposit];
            mySqlQuery(sql, params, (err, queryResult) => {
                if(err) {
                    result.errMsg = "服务器异常";
                    result.code = "0";
                    res.json(result);
                    return false;
                }
                result.code = "200";
                result.errMsg = "appoint successfully";
                res.json(result);
            })
        }
    })
})

module.exports = router;