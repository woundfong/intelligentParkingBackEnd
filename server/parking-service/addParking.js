const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
    console.log(req.body);
    let sql, params = [], result = {}, date = new Date(),
        address = req.body.address, remark = req.body.remark,
        latitude = req.body.latitude, longitude = req.body.longitude,
        master_id = req.body.master_id;
    if(req.body.type == 'unit') {
        sql = "INSERT INTO parking_unit(parking_unit_id, master_id, latitude, longitude, address, remark, create_time)" +
              " VALUES(nextval('parking_unit'),?,?,?,?,?,?)";
    } else if(req.body.type == 'lot') {
        sql = "INSERT INTO parking_lot(master_id, latitude, longitude, address, remark, create_time)" +
              " VALUES(?,?,?,?,?,?)";
    }
    params = [master_id, latitude, longitude, address, remark, date];
    mySqlQuery(sql, params, (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = '0';
            res.json(result);
            throw err;
        }
        result.errMsg = "query successfully";
        result.code = '200';
        if(req.body.type == 'lot') {
            result.insertId = queryResult.insertId;
        }
        res.json(result);
    })
})
module.exports = router;