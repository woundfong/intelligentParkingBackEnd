const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');
const getUserParkingStatus = require('../user-service/getUserParkingStatus');

router.get('/', (req, res, next) => {
    let result = {}, 
        sql = "select occ.occupied_id,appo.appointment_id from occupied_table occ left join appointment_table appo " +
        "on occ.occ_parking_unit_id = appo.appoint_parking_unit_id" +
        " where occ_parking_unit_id = ?",
        params = [req.query.id];
    mySqlQuery(sql, params, (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        result.errMsg = "query successfully";
        result.code = "200";
        result.status = 200;
        if(queryResult.length > 0) {
            if(queryResult[0].occupied_id) {
                result.status = 1;
            } else if(queryResult[0].appointment_id) {
                result.status = 2;
            }
        }
        if(result.status != 200) {
            res.json(result);
            return false;
        }
        getUserParkingStatus(req.query.user, "appoint", (err, status, appointInfo) => {
            if(err) {
                result.errMsg = "服务器异常";
                result.code = "0";
                res.json(result);
                return false;
            }
            if(status == 0) {
                result.status = 3; //当前用户已有其它预约
                result.appointInfo = appointInfo[0];
            }
            res.json(result);
        })
    })
})
module.exports = router;