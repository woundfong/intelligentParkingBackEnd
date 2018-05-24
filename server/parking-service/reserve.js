const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
    let result = {};
    let sql = "select reserve_id from reservation where user_id = ?;" + 
              "select reserve_id from reservation where parking_unit_id = ?";
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
            res.json(result);
        } else if(queryResults[1].length > 0) {
            result.errMsg = "抱歉，已有其他人预约了此车位";
            result.code = "0";
            res.json(result);
        } else {
            sql = "insert into reservation(start_time,parking_unit_id,user_id,coupon_id,licensePlate) " +
                  "values(?,?,?,?,?)";
            let now = new Date();
            params = [now, req.body.parkingUnitId, req.body.user,req.body.couponId,req.body.licensePlate];
            mySqlQuery(sql, params, (err, queryResult) => {
                if(err) {
                    result.errMsg = "服务器异常";
                    result.code = "0";
                    res.json(result);
                    throw err;
                    return false;
                }
                result.code = "200";
                result.errMsg = "reserve successfully";
                result.reserveId = queryResult.insertId;
                res.json(result);
            })
        }
    })
})
router.post('/cancel', (req, res, next) => {
    let result = {}, 
        sql = "delete from reservation where reserve_id = ? and start_time >= ?",
        now = new Date();
    let min = now.getMinutes();
    now.setMinutes(min - 30);
    let params = [req.body.reserveId, now];
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    if(queryResult.affectedRows > 0) {
        result.code = "200";
    } else {
        result.code = "1";
        result.errMsg = "预约已过期";
    }
    res.json(result);
  })
})
module.exports = router;