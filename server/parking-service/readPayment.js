let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
    let result = {}, 
        sql = "update parking_history set has_read = 1 where parking_history_id = ?",
        params = [req.query.id]; 
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "update successfully";
    result.code = "200";
    res.json(result);
  })
})
module.exports = router;