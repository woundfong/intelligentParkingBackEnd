const express = require('express');
const router = express.Router();
const execTrans = require('../public/execTransaction');
const mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
    let occSql = "", result = {}, occParams = [], sqlEntities = [];
    occSql = "insert into occupied_table(occ_parking_unit_id,user_id,start_time) values(?,?,?,?)";
    let now = new Date();
    occParams = [req.body.id, req.body.user, now];
    sqlEntities.push({sql: occSql, params: occParams});
    let appoSql = "delete from appointment_table where user_id = ? and appoint_parking_unit_id = ?";
    let appoParams = [req.body.user, req.body.id];
    sqlEntities.push({sql: appoSql, params: appoParams});
    execTrans(sqlEntities, (err, queryResult) => {
      if(err) {
        result.errMsg = "服务器异常";
        result.code = "0";
        res.json(result);
        return false;
      }
      result.errMsg = "park successfully";
      result.code = "200";
      res.json(result);
    })
})
module.exports = router;