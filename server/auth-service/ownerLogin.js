const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');
const session = require('express-session');
router.post('/', (req, res, next) => {
    console.log(req.body);
    let result = {}, sql = "select * from owner where user_id = ? and password = ?",
        params = [req.body.owner, req.body.password]; 
    mySqlQuery(sql, params, (err, queryResult) => {
      if(err) {
        result.errMsg = "服务器异常";
        result.code = "0";
        res.json(result);
        return false;
      }
      console.log(queryResult);
      if(queryResult.length > 0) {
          result.code = "200";
          req.session.iparkUser = req.body.owner;
          res.cookie("iparkUser", req.body.owner);
          var isAdmin = "0";
          if(req.body.owner == "admin") {
              isAdmin = "1";
          }
          res.cookie("isAdmin", isAdmin);
      } else {
          result.code = "0";
          result.errMsg = "账号密码不正确";
      }
      res.json(result);
  })
})

module.exports = router;