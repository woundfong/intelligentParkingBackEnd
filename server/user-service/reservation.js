const express = require('express');
const router = express.Router();
//const getUserParkingStatus = require('./getUserParkingStatus');
const mySqlQuery = require('../public/mySqlQuery');

router.get('/', (req, res, next) => {
    let result = {}, 
        sql = "select r.reserve_id,r.parking_unit_id,r.start_time,r.licensePlate," +
              "c.type as coupon_type,c.value as coupon_value, " +
              "p.address,p.open_time,p.latitude,p.longitude " +
              "from reservation r left join coupon c on r.coupon_id=c.coupon_id " +
              "left join parking_unit p on r.parking_unit_id=p.parking_unit_id " +
              "where r.user_id = ? and r.parked = 0";
    let params = [req.query.user];
    mySqlQuery(sql, params, (err, queryResult) => {
      if(err) {
        console.log(err);
        result.errMsg = "服务器异常";
        result.code = "0";
        res.json(result);
        return false;
      }
      result.code = "200";
      result.errMsg = "query successfully!";
      result.hasReservation = false;
      if(queryResult.length > 0 && queryResult[0].reserve_id) {
        result.hasReservation = true;
        result.reservation = queryResult[0];
      }
      res.json(result);
    })
    // getUserParkingStatus(req.query.user, "appoint", (err, status, queryResult) => {
    //   if(err) {
    //     result.errMsg = "服务器异常";
    //     result.code = "0";
    //     res.json(result);
    //     return false;
    //   }
    //   result.code = "200";
    //   result.errMsg = "query successfully!";
    //   if(status == 1) {
    //     result.hasReservation = false;
    //     res.json(result);
    //   } else {
    //     result.hasReservation = true;
    //     result.reservation = queryResult;
    //     res.json(result);
    //   }
    // })
})
module.exports = router;