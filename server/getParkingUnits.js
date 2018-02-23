var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../config/db');
var pool = mysql.createPool(db.mysql);

var SQL = "select * from parking_unit where latitude > ? and latitude < ? and longitude > ? and longitude < ?";

/* GET home page. */
router.get('/', (req, res, next) => {
  var params = [];
  var result = {};
  var region = req.query.region;
  if(typeof region !== "undefined") {
    region = JSON.parse(region);
    //console.log(region.northeast);
    var north = region.northeast.latitude, south = region.southwest.latitude,
      west = region.southwest.longitude, east = region.northeast.longitude;
    params = [south, north, west, east];
  }
  
  var master = req.query.master;
  if(typeof master !== "undefined") {
    SQL = "select * from parking_unit where master_id = ?";
    params = [master];
  }
  pool.getConnection((err, connection) => {
        connection.query(SQL, params, (err, queryResult) => {
          if(err) {
            result.msg = "error: " + err.sqlMessage;
            result.code = '0';
            res.json(result);
            console.log("mysql error: " + err.sqlMessage);
          }else {
            result.msg = "query successfully";
            result.code = '200';
            result.parkingUnits = queryResult;
            res.json(result);
          }
        })
        connection.release();
    })
});

module.exports = router;
