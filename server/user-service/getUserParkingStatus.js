const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

function getUserParkingStatus(user, type, callback) {
    let result = {}, sql = "", params = [];
    if(type == "appoint") {
        sql = "select r.reserve_id,r.parking_unit_id,r.start_time,r.licensePlate,c.type as coupon_type, " +
        "c.value as coupon_value from reservation r left join coupon c on r.coupon_id=c.coupon_id " +
        "where r.user_id = ? and r.start_time >= ?";
        let date = new Date();
        let min = date.getMinutes();
        date.setMinutes(min - 30);
        params = [user, date];
    } else {
        sql = "select occupied_id,occ_parking_unit_id,start_time from occupied_table where user_id = ?";
        params = [user];
    }
    mySqlQuery(sql, params, (err, queryResult) => {
        if(err) {
            callback(err, null);
        } else {
            if(queryResult.length > 0) {
                callback(null, 0, queryResult[0]);
            } else {
                callback(null, 1, queryResult[0]);
            }
        }
    })
}
module.exports = getUserParkingStatus;