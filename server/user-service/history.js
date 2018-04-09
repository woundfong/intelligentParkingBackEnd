let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.get('/', (req, res, next) => {
    let result = {}, sql = "select * from parking_history where user_id = ? order by end_time desc",
        params = [req.query.user]; 
    mySqlQuery(sql, params, (err, queryResult) => {
      console.log(queryResult);
      if(err) {
        result.errMsg = "服务器异常";
        result.code = "0";
        res.json(result);
        return false;
      }
      result.errMsg = "query successfully";
      result.code = "200";
      result.history = queryResult;
      res.json(result);
  })
})

router.get('/read', (req, res, next) => {
    let result = {}, sql = "call readHistory(?)",
        params = [req.query.historyId]; 
    mySqlQuery(sql, params, (err, queryResult) => {
      console.log(queryResult);
      if(err) {
        result.errMsg = "服务器异常";
        result.code = "0";
        res.json(result);
        return false;
      }
      result.errMsg = "query successfully";
      result.code = "200";
      result.history = queryResult[0][0];
      res.json(result);
  })
})

router.get('/unread', (req, res, next) => {
    let result = {}, sql = "select parking_history_id from parking_history where user_id = ? and has_read = 0",
        params = [req.query.user]; 
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.history = queryResult;
    res.json(result);
  })
})
module.exports = router;