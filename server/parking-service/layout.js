const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

router.get('/', (req, res, next) => {
    let result = {}, 
        sql = "select layout from parking_lot_layout where layout_id = ?",
        params = [req.query.id]; 
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.layout = queryResult[0].layout;
    res.json(result);
  })
})
router.post('/add', (req, res, next) => {
    let result = {}, 
        sql = "insert into parking_lot_layout(layout) values(?)",
        params = [req.body.layout]; 
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "update successfully";
    result.code = "200";
    result.layoutId = queryResult.insertId;
    res.json(result);
  })
})
router.post('/update', (req, res, next) => {
    let result = {}, 
        sql = "update parking_lot_layout set layout = ? where layout_id = ?",
        params = [req.body.layout, req.body.id]; 
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