let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');
let responseWithNoCache = require('../public/responseWithNoCache')

/* GET home page. */
router.get('/', (req, res, next) => {
  let result = {}, 
  sql = "select p.parking_unit_id,p.address,p.remark,p.create_time,p.open_time,p.status,p.grantList," 
    +"occ.occupied_id,occ.start_time as occ_start_time,occ.user_id as occ_user_id,r.reserve_id,"
    +"m.price from parking_unit p left join occupied_table occ on "
    + "p.parking_unit_id = occ.occ_parking_unit_id left join reservation r " 
    +"on p.parking_unit_id = r.parking_unit_id left join price m on p.price_id = m.price_id ";
  let query = req.query, params = [];
  if(query.id) {
    sql += "where p.parking_unit_id = ?";
    params = [query.id];
  } else if(query.num && query.parkingLotId) {
    sql += "where p.num = ? and p.parking_lot_id = ?";
    params = [query.num, query.parkingLotId]
  }
  //let region = req.query.region;
  mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      throw err;
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.unitInfo = queryResult[0];
    res.json(result);
  })
});

module.exports = router;
