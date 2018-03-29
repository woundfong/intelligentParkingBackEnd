const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config/db');
const pool = mysql.createPool(db.mysql);
const execTrans = require('../public/execTransaction');
router.post('/', (req, res, next) => {
    let user = req.body.user, sql = "", result = {}, params = [];
    sql = "select appoint.start_time as appoint_start_time,appoint.estimated_end_time as appoint_end_time," +
          "appoint.arrived as appoint_arrived,occ.occ_parking_unit_id as parking_unit_id,occ.start_time as " +
          "occ_start_time,occ.user_id as user_id " +
          "from occupied_table occ left join appointment_table appoint " +
          "on appoint.appoint_parking_unit_id = occ.occ_parking_unit_id " +
          "and appoint.user_id = occ.user_id where occ.user_id = ?",
    params = [user];
})
module.exports = router;