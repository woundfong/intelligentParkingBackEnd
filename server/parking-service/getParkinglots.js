const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');
const responseWithNoCache = require('../public/responseWithNoCache')

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
  } else if(query.owner) {
    let owner = query.owner;
    sql = "select * from parking_lot where owner_id = ?";
    params = [owner];
  }

  mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      console.log(err)
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      throw err;
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.parkingLots = queryResult;
    res.json(result);
  })
});
router.get('/console', (req, res) => {
  let params = [];
  let result = {};
  let query = req.query;
  let sql = "select * from parking_lot where owner_id = 2";
  params = [];
  mySqlQuery(sql, params, (err, queryResults) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.parkingLots = queryResults;
    res.json(result);
  })
})
module.exports = router;
