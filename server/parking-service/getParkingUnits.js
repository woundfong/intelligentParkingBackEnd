let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');
let responseWithNoCache = require('../public/responseWithNoCache')

/* GET home page. */
router.get('/', (req, res, next) => {
  let params = [];
  let result = {};
  let sql = "select p.parking_unit_id,p.latitude,p.longitude,p.address,p.remark,occ.occupied_id,r.reserve_id from parking_unit p left join occupied_table occ "+
            "on p.parking_unit_id = occ.occ_parking_unit_id " +
            "left join reservation r on p.parking_unit_id = r.parking_unit_id " +
            "where p.latitude > ? and p.latitude < ? and p.longitude > ? and p.longitude < ? and p.parking_lot_id = 1 and p.status = 1";
  let query = req.query;
  //let region = req.query.region;
  if(query.north && query.south && query.north && query.east) {
    let north = query.north, south = query.south,
          west = query.west, east = query.east;
    params = [south, north, west, east];
    //region = JSON.parse(region);
    // let north = region.northeast.latitude, south = region.southwest.latitude,
    //   west = region.southwest.longitude, east = region.northeast.longitude;
  } else if(query.owner) {
    let owner = query.owner;
    owner = parseInt(owner);
    sql = "select p.parking_unit_id,p.address,p.remark,p.create_time," 
    +"occ.occupied_id,occ.start_time as occ_start_time,occ.user_id as occ_user_id,r.reserve_id,"
    +"r.user_id as r_user_id,r.start_time as r_start_time"
    +" from parking_unit p left join occupied_table occ on "
    + "p.parking_unit_id = occ.occ_parking_unit_id left join reservation r " 
    +"on p.parking_unit_id = r.parking_unit_id where p.owner_id = ?";
    params = [owner];
  }
  mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      console.log(err);
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.parkingUnits = queryResult;

    responseWithNoCache(res, result);
  })
});

module.exports = router;
