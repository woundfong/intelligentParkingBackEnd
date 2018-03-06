var express = require('express');
var router = express.Router();
var mySqlQuery = require('./mySqlQuery');

var SQL = "select * from parking_unit where latitude > ? and latitude < ? and longitude > ? and longitude < ?";

/* GET home page. */
router.get('/', (req, res, next) => {
  var params = [];
  var result = {};
  var region = req.query.region;
  if(typeof region !== "undefined") {
    region = JSON.parse(region);
    var north = region.northeast.latitude, south = region.southwest.latitude,
      west = region.southwest.longitude, east = region.northeast.longitude;
    params = [south, north, west, east];
  }
  
  var master = req.query.master;
  if(typeof master !== "undefined") {
    SQL = "select * from parking_unit where master_id = ?";
    params = [master];
  }
  mySqlQuery(SQL, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = '0';
      res.json(result);
      throw err;
    }
    result.errMsg = "query successfully";
    result.code = '200';
    result.parkingUnits = queryResult;
    res.json(result);
  })
});

module.exports = router;
