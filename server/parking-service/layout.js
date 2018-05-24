const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');

router.get('/', (req, res, next) => {
    let result = {}, 
        sql = "select layout from parking_lot_layout where layout_id = ?;" + 
              "select p.num,r.reserve_id,occ.occupied_id from parking_unit p left join " + 
              "reservation r on p.parking_unit_id = r.parking_unit_id left join occupied_table occ " +
              "on p.parking_unit_id = occ.occ_parking_unit_id where p.parking_lot_id in " +
              "(select parking_lot_id from parking_lot where layout_id = ?)",
        params = [req.query.id, req.query.id]; 
    mySqlQuery(sql, params, (err, queryResults) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.layout = queryResults[0][0].layout;
    let statuss = {};
    if(queryResults[1]) {
      let arr = queryResults[1];
      let len = arr.length;
      for(let i = 0; i < len; i++) {
        statuss[arr[i].num] = (arr[i].reserve_id || arr[i].occupied_id) ? 0 : 1;
      }
    }
    result.status = statuss;
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