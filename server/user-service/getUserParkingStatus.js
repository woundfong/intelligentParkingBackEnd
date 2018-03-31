const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

function getUserParkingStatus(user, type, callback) {
    let result = {}, sql = "", params = [];
    if(type == "appoint") {
        sql = "select appointment_id,appoint_parking_unit_id from appointment_table where user_id = ? " +
              "and estimated_end_time >= ?";
        let now = new Date();
        params = [user, now];
    } else {
        sql = "select occupied_id,occ_parking_unit_id,start_time from occupied_table where user_id = ?";
        params = [user];
    }
    mySqlQuery(sql, params, (err, queryResult) => {
        if(err) {
            callback(err, null);
        } else {
            if(queryResult.length > 0) {
                callback(null, 0, queryResult);
            } else {
                callback(null, 1, queryResult);
            }
        }
    })
}
module.exports = getUserParkingStatus;