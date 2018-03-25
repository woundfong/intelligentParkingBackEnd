let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.get('/', (req, res, next) => {
    let params = [], result = {}, sql = "";
    sql = "select occ_parking_unit_id,start_time,estimated_end_time from occupied_table" +
            " where user_id = ?"
    params = [req.query.user, req.query.user]; 
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = '0';
      res.json(result);
      throw err;
    }
    result.errMsg = "query successfully";
    result.code = '200';
    result.occInfo = queryResult;
    res.json(result);
  })
})
module.exports = router;