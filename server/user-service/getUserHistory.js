let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.get('/unread', (req, res, next) => {
    let result = {}, sql = "select parking_history_id from parking_history where user_id = ? and has_read = 0",
        params = [req.query.user]; 
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      throw err;
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.history = queryResult;
    res.json(result);
  })
})
module.exports = router;