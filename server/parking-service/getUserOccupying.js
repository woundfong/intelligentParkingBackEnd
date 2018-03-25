let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.get('/', (req, res, next) => {
    let params = [], result = {}, sql = "";
    sql = "select occ_parking_unit_id,start_time,estimated_end_time from parking_unit_occupied_table" +
            " where user_id = ?;" +
            "select occ_parking_lot_unit_id,start_time,estimated_end_time from parking_lot_occupied_table" +
            " where user_id = ?"
    params = [req.query.user, req.query.user]; 
    mySqlQuery(sql, params, (err, queryResults) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = '0';
      res.json(result);
      throw err;
    }
    result.errMsg = "query successfully";
    result.code = '200';
    if(queryResults[0].length > 0) {
        result.occType = "parkingUnit";
        result.occInfo = queryResults[0][0];
    } else if(queryResults[1].length > 0) {
        result.occType = "parkingLotUnit";
        result.occInfo = queryResults[1][0];
    } else {
        result.occType = "none";
    }
    res.json(result);
  })
})
module.exports = router;