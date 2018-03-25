const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
    console.log(req.body);
    let sql, params = [], result = {}, date = new Date(),
        address = req.body.address, remark = req.body.remark,
        latitude = req.body.latitude, longitude = req.body.longitude,
        master_id = req.body.master_id;
    sql = "insert into applying_list(apply_master_id,type,remark,address,apply_date,latitude,longitude) values(?,?,?,?,?,?,?)";
    params = [master_id, req.body.type, remark, address, date, latitude, longitude];
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