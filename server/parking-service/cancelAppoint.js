let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
    let result = {}, 
        sql = "delete from appointment_table where appointment_id = ? and estimated_end_time >= ?",
        now = new Date();
    let params = [req.body.appointmentId, now];
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    if(queryResult.affectedRows > 0) {
        result.code = "200";
    } else {
        result.code = "1";
        result.errMsg = "预约已过期";
    }
    res.json(result);
  })
})
module.exports = router;