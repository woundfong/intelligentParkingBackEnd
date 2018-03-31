let express = require('express');
let router = express.Router();
let mySqlQuery = require('../public/mySqlQuery');

router.get('/', (req, res, next) => {
    let result = {},
        sql = "select price from price where price_id in (select price_id from parking_unit where parking_unit_id = ?)",
        params = [req.query.parkingUnitId];
    mySqlQuery(sql, params, (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        result.errMsg = "query successfully";
        result.code = "200";
        result.price = queryResult[0].price;
        res.json(result);
    });
})

module.exports = router;