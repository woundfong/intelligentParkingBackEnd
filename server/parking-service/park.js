const express = require('express');
const router = express.Router();
const execTrans = require('../public/execTransaction');
const mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
  console.log(req.body);
    let occSql = "", result = {}, occParams = [];
    occSql = "insert into occupied_table(occ_parking_unit_id,user_id,start_time,reserve_id) values(?,?,?,?)";
    let now = new Date();
    occParams = [req.body.id, req.body.user, now, req.body.reserveId];
    let rSql = "update reservation set parked = 1 where reserve_id = ?",
        rParams = [req.body.reserveId];
    let sqlEntities = [
      {
        sql: occSql,
        params: occParams
      },
      {
        sql: rSql,
        params: rParams
      }
    ];
    execTrans(sqlEntities, (err, queryResults) => {
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
    // mySqlQuery(occSql, occParams, (err, queryResult) => {
    //   if(err) {
    //     result.errMsg = "服务器异常";
    //     result.code = "0";
    //     res.json(result);
    //     return false;
    //   }
    //   result.errMsg = "park successfully";
    //   result.code = "200";
    //   res.json(result);
    // })
})
module.exports = router;