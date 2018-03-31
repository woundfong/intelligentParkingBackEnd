const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

let sql = "select * from coupon where wallet_id = ? and validDate >= ? and has_used = 0 " +
          "order by validDate desc";

router.get('/', (req, res, next) => {
    let now = new Date();
    let params = [req.query.wallet, now], result = {};
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.coupons = queryResult;
    res.json(result);
  })
})
router.get('/count', (req, res, next) => {
    let params = [req.query.wallet], result = {};
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.couponNum = queryResult.length;
    res.json(result);
  })
})
module.exports = router;