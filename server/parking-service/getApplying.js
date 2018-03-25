let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

let sql = "select apply_id,apply_date,address,remark from applying_list " +
          "where master_id = ?";

router.get('/', (req, res, next) => {
    let params = [req.query.master], result = {};
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = '0';
      res.json(result);
      throw err;
    }
    result.errMsg = "query successfully";
    result.code = '200';
    result.applying = queryResult;
    res.json(result);
  })
})
module.exports = router;