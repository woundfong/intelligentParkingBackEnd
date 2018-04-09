const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');
router.post('/', (req, res, next) => {
    console.log(req.body);
    let result = {}, sql = "select * from master where user_id = ? and password = ?",
        params = [req.body.master, req.body.password]; 
    mySqlQuery(sql, params, (err, queryResult) => {
      if(err) {
        result.errMsg = "服务器异常";
        result.code = "0";
        res.json(result);
        return false;
      }
      if(queryResult.length > 0) {
          result.code = "200";
      } else {
          result.code = "0";
          result.errMsg = "账号密码不正确";
      }
      res.json(result);
  })
})

module.exports = router;