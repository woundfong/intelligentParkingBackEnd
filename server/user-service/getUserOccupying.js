const express = require('express');
const router = express.Router();
const getUserParkingStatus = require('./getUserParkingStatus');

router.get('/', (req, res, next) => {
    let result = {};
    getUserParkingStatus(req.query.user, "occ", (err, status, queryResult) => {
      if(err) {
        result.errMsg = "服务器异常";
        result.code = "0";
        res.json(result);
        return false;
      }
      result.code = "200";
      result.errMsg = "query successfully!";
      if(status == 1) {
        result.isOcc = false;
        res.json(result);
      } else {
        result.isOcc = true;
        result.occInfo = queryResult;
        res.json(result);
      }
    })
})
module.exports = router;