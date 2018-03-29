let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');
let responseWithNoCache = require('../public/responseWithNoCache')

/* GET home page. */
router.get('/', (req, res, next) => {
  let params = [];
  let result = {};
  let query = req.query;
  let sql = "select * from parking_lot where latitude > ? and latitude < ? and longitude > ? and longitude < ?";
  //let region = req.query.region;
  if(query.north && query.south && query.north && query.east) {
      let north = query.north, south = query.south,
          west = query.west, east = query.east;
      params = [south, north, west, east];
  } else if(query.master) {
    let master = query.master;
    master = parseInt(master);
    sql = "select * from parking_lot where master_id = ?";
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
    result.parkingLots = queryResult;
    res.json(result);
  })
});

module.exports = router;
