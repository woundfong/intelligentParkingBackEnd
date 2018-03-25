let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
    let type = req.body.type, sql = "", result = {}, params = [];
    if(type == "parkingUnit") {
      sql = "insert into parking_unit_occupied_table values(?,?,?,?)";
    } else {
      sql = "insert into parking_lot_occupied_table values(?,?,?,?)";
    }
    let now = new Date(), end_time = new Date(req.body.estimated_end_time);
    params = [req.body.id, req.body.user, now, end_time];
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = '0';
      res.json(result);
      throw err;
    }
    result.errMsg = "park successfully";
    result.code = '200';
    res.json(result);
  })
})
module.exports = router;