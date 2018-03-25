let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.post('/', (req, res, next) => {
    let params = [req.body.money, req.body.wallet], result = {}, sql;
    if(req.body.type == "tradition") {
      sql = "update wallet set balance = balance + ? where wallet_id = ?";
    } else {
      sql = "update wallet set deposit = deposit + ? where wallet_id = ?";
    }
    mySqlQuery(sql, params, (err, queryResult) => {
    if(err) {
      result.errMsg = "服务器异常";
      result.code = '0';
      res.json(result);
      throw err;
    }
    result.errMsg = "update successfully";
    result.code = '200';
    res.json(result);
  })
})
module.exports = router;