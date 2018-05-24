let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.get('/', (req, res, next) => {
    let params = [req.query.owner], result = {};
    let sql = "select apply_id,apply_date from applying " +
          "where apply_owner_id = ?";
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = "0";
      res.json(result);
      return false;
    }
    result.errMsg = "query successfully";
    result.code = "200";
    result.applying = queryResult;
    res.json(result);
  })
})

module.exports = router;