let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.get('/', (req, res, next) => {
    let params = [], result = {}, sql = "";
    if(req.query.id) {
        if(req.query.type == 'parkingUnit') {
            sql = "select * from parking_unit_occupied_table where occ_parking_unit_id = ?";
        }else {
            sql = "select * from parking_lot_occupied_table where occ_parking_lot_unit_id = ?";
        }
        params = [req.query.id];
    } else if(req.query.user) {
        sql = "select occ_parking_unit_id,start_time,estimated_end_time from parking_unit_occupied_table" +
              " where user_id = ?;" +
              "select occ_parking_lot_unit_id,start_time,estimated_end_time from parking_lot_occupied_table" +
              " where user_id = ?"
        params = [req.query.user, req.query.user];
    }   
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = '0';
      res.json(result);
      throw err;
    }
    result.errMsg = "query successfully";
    result.code = '200';
    result.applying = queryResult;
    res.json(result);
  })
})
module.exports = router;