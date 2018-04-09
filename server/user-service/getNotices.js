const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');
const getDate = require('../public/getDate');
router.get('/', (req, res, next) => {
    let result = {}, sql = "call readNotice(?)",
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
      result.noticeList = queryResult[0];
      res.json(result);
  })
})
router.get('/check', (req, res, next) => {
    let result = {}, 
    sql = "select notice_id from notice where user_id = ? and has_read = 0;" + 
          "select notice_id from notice where user_id = 'ALLUSERS' and create_date >= ?";
    let yesterday = new Date();
    let day = yesterday.getDate();
    yesterday.setDate(day-1);
    yesterday = getDate.getDateFormat(yesterday, "yyyy-MM-dd");
    params = [req.query.user, yesterday]; 
    mySqlQuery(sql, params, (err, queryResults) => {
      if(err) {
        result.errMsg = "服务器异常";
        result.code = "0";
        res.json(result);
        return false;
      }
      result.errMsg = "query successfully";
      result.code = "200";
      if(queryResults[0].length + queryResults[1].length >= 1) {
          result.hasNotice = true;
      } else {
          result.hasNotice = false;
      }
      res.json(result);
  })
})
module.exports = router;