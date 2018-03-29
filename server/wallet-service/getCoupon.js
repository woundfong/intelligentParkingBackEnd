const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

let sql = "select * from coupon where wallet_id = ? order by period_of_validity desc";

router.get('/', (req, res, next) => {
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
    let date = new Date();
    for(let i = 0; i < queryResult.length; i++) {
      if(new Date(queryResult[i].period_of_validity) < date) {
        queryResult[i].isOutOfDate = true;
      }else {
        queryResult[i].isOutOfDate = false;
      }
    }
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