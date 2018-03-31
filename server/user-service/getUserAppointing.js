const express = require('express');
const router = express.Router();
const getUserParkingStatus = require('./getUserParkingStatus');

router.get('/', (req, res, next) => {
    let result = {};
    getUserParkingStatus(req.query.user, "appoint", (err, status, queryResult) => {
      if(err) {
        result.errMsg = "服务器异常";
        result.code = "0";
        res.json(result);
        return false;
      }
      result.code = "200";
      result.errMsg = "query successfully!";
      if(status == 1) {
        result.hasAppo = false;
        res.json(result);
      } else {
        result.hasAppo = true;
        result.appoInfo = queryResult[0];
        res.json(result);
      }
    })
})
module.exports = router;