const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');
const execTrans = require('../public/execTransaction');
const getDate = require('../public/getDate');
router.post('/', (req, res, next) => {
    let result = {};
    let sql = "select p.price,occ.start_time from price p left join occupied_table occ " + 
              "on occ.occ_parking_unit_id in " + 
              "(select parking_unit_id from parking_unit where price_id = p.price_id) "+
              "where occ.occ_parking_unit_id = ?;" + 
              "select * from coupon where wallet_id in (select wallet_id from users where user_id = ?) " +
              "and validDate >= ? and has_used = 0 order by value asc";
    let params = [req.body.parkingUnitId, req.body.user, new Date()];
    mySqlQuery(sql, params, (err, queryResults) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            throw err;
            return false;
        }
        let priceStr = queryResults[0][0].price, startTime = queryResults[0][0].start_time, 
            couponId = 1, couponValue = 1;
        if(queryResults[1].length > 0) { //自动选择优惠券
            couponId = queryResults[1][0].coupon_id;
            couponValue = queryResults[1][0].value;
        }
        let now = new Date(), start = new Date(startTime), 
            price = JSON.parse(priceStr);
        let tmpDate = new Date(startTime), total = 0, cost = 0;
        while(tmpDate < now) {
            console.log(tmpDate.getDate());
            for(let i = 0; i < price.length; i++) {
                let sectionStartDate = getDate.deeplyCloneDate(tmpDate), //需要和区间计算时间保持相同的年月日 
                    sectionEndDate = getDate.deeplyCloneDate(tmpDate);
                let priceStart = price[i].start.split(":"), priceEnd = price[i].end.split(":");
                sectionStartDate.setHours(priceStart[0]);
                sectionStartDate.setMinutes(priceStart[1]);
                sectionStartDate.setSeconds(0);
                sectionEndDate.setHours(priceEnd[0]);
                sectionEndDate.setMinutes(priceEnd[1]);
                sectionEndDate.setSeconds(0);
                
                if(tmpDate >= sectionStartDate && tmpDate <= sectionEndDate) {
                    let sectionEnd = (now <= sectionEndDate) ? now : sectionEndDate;
                    let money = Math.ceil((sectionEnd - tmpDate) / (1000*60*60)) * price[i].price;
                    total += money;
                    tmpDate = sectionEnd;
                    break;
                }
            }
        }
        cost = total * couponValue;
        let deDuctSql = "update wallet set balance = balance - ? where wallet_id in " +
                        "(select wallet_id from users where user_id = ?)",
            deleteOccSql = "delete from occupied_table where occ_parking_unit_id = ?",
            addHistorySql = "insert into parking_history(parking_unit_id,start_time,end_time," +
                            "user_id,total,cost,coupon_id,has_read) values(?,?,?,?,?,?,?,0)";
        let deDuctParams = [total, req.body.user],
            deleteOccParams = [req.body.parkingUnitId],
            addHistoryParams = [req.body.parkingUnitId, startTime, now, req.body.user, total, cost, couponId];
        let sqlEntities = [
            {
                sql: deDuctSql,
                params: deDuctParams
            },
            {
                sql: deleteOccSql,
                params: deleteOccParams
            },
            {
                sql: addHistorySql,
                params: addHistoryParams
            }
        ];
        if(couponId != 1) {
            let useCouponSql = "update coupon set has_used = 1 where coupon_id = ?",
                useCouponParams = [couponId];
            sqlEntities.push({
                sql: useCouponSql,
                params: useCouponParams
            })
        }
        execTrans(sqlEntities, (err, queryResult) => {
            if(err) {
                result.errMsg = "服务器异常";
                result.code = "0";
                res.json(result);
                return false;
            } else {
                result.errMsg = "endparking successfully";
                result.code = "200";
                result.historyId = queryResult[2].insertId;
                res.json(result);
            }
        })
    })
})
module.exports = router;