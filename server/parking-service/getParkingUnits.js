let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');
let responseWithNoCache = require('../public/responseWithNoCache')

/* GET home page. */
router.get('/', (req, res, next) => {
  let params = [];
  let result = {};
  let sql = "select * from parking_unit p left join occupied_table occ "+
            "on p.parking_unit_id = occ.occ_parking_unit_id " +
            "left join appointment_table appo on p.parking_unit_id = appo.appoint_parking_unit_id " +
            "where latitude > ? and latitude < ? and longitude > ? and longitude < ?";
  let query = req.query;
  //let region = req.query.region;
  if(query.north && query.south && query.north && query.east) {
    let north = query.north, south = query.south,
          west = query.west, east = query.east;
    params = [south, north, west, east];
    //region = JSON.parse(region);
    // let north = region.northeast.latitude, south = region.southwest.latitude,
    //   west = region.southwest.longitude, east = region.northeast.longitude;
  } else if(query.master) {
    let master = query.master;
    master = parseInt(master);
    sql = "select * from parking_unit p left join occupied_table occ on "
    + "p.parking_unit_id = occ.occ_parking_unit_id left join appointment_table appo " 
    +"on p.parking_unit_id = appo.appoint_parking_unit_id where p.master_id = ?";
    params = [master];
  }
  mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
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
