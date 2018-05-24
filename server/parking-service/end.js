const mySqlQuery = require('../public/mySqlQuery');
const execTrans = require('../public/execTransaction');
const getDate = require('../public/getDate');
const mysql = require('mysql');
const db = require('../../config/db');
const pool = mysql.createPool(db.mysql);
const async = require("async");
const probabilityOfTicket = 0.1, probabilityOfCoupon = 0.9;

function endPark(req, callback) {
    let result = {};
    let sql = "select occ.user_id as occ_user,occ.start_time,occ.reserve_id,pr.price," +
              "c.coupon_id,c.value,c.type,p.open_time,u.user_id as owner,w.wallet_id from occupied_table occ " +
              "left join parking_unit p on occ.occ_parking_unit_id = p.parking_unit_id " +
              "left join price pr on p.price_id = pr.price_id " +
              "left join wallet w on w.user_id = occ.user_id " +
              "left join users u on u.user_id in (select user_id from owner where owner_id in (select owner_id from parking_unit where parking_unit_id = ?)) " +
              "left join coupon c on c.coupon_id in (select coupon_id from reservation where reserve_id = occ.reserve_id) " +
              "where occ.occ_parking_unit_id = ?";
    let params = [req.body.user, req.body.parkingUnitId];
    mySqlQuery(sql, params, (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            callback(result);
            throw err;
            return false;
        }
        let priceStr = queryResult[0].price, startTime = queryResult[0].start_time, 
            couponId = queryResult[0].coupon_id, couponValue = queryResult[0].value,
            occ_user = queryResult[0].occ_user, reserve_id = queryResult[0].reserve_id,
            owner = queryResult[0].owner, wallet_id = queryResult[0].wallet_id;
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
                    if(tmpDate.getHours() == 23 && tmpDate.getMinutes() == 59) {
                        tmpDate.setDate(tmpDate.getDate() + 1);
                        tmpDate.setHours(0);
                        tmpDate.setMinutes(0);
                        tmpDate.setSeconds(0);
                    }
                    break;
                }
            }
        }
        cost = total * couponValue;
        let rndOfCoupon = Math.random(), 
            newCoupon = {
                value: 1,
                type: "discount"
            },
            hasCoupon = false;
        if(rndOfCoupon > 0.2) {
            hasCoupon = true;
            console.log("------------has new coupon-----------")
        }
        if(hasCoupon) {
            let rnd = Math.random();
            rnd = rnd.toFixed(2);
            if(rnd <= 0.01) {
                newCoupon.value = 0;
                newCoupon.type = "ticket";
            } else if(rnd <= 0.06) {
                newCoupon.value = 0.5;
                newCoupon.type = "discount";
            } else if(rnd <= 0.15) {
                newCoupon.value = 0.6;
                newCoupon.type = "discount";
            } else if(rnd <= 0.3) {
                newCoupon.value = 0.7;
                newCoupon.type = "discount";
            } else if(rnd <= 0.5) {
                newCoupon.value = 0.8;
                newCoupon.type = "discount";
            } else {
                newCoupon.value = 0.9;
                newCoupon.type = "discount";
            }
            console.log("new coupon " + newCoupon.value);
        }
        
        pool.getConnection((err, connection) => {
            if(err) {
                result.code = "0";
                result.errMsg = "服务器异常";
                callback(result);
                throw err;
                return false;
            }
            connection.beginTransaction(err => {
                if(err) {
                    result.code = "0";
                    result.errMsg = "服务器异常";
                    callback(result);
                    throw err;
                    return false;
                }
                let s = "", p = [];
                if(hasCoupon) {
                    s = "insert into coupon(wallet_id,value,type,validDate,has_used) values(?,?,?,?,0)";
                    p = [wallet_id, newCoupon.value, newCoupon.type, "2018-05-30 23:59:59"];
                } else {
                    s = "update wallet set balance = balance - ? where user_id = ?";
                    p = [total, req.body.user];
                }
                connection.query(s, p, (err, rowsf) => {
                    if(err) {
                        connection.rollback((e) => {
                            console.log("transaction error: " + e);
                            connection.release();
                            result.code = "0";
                            result.errMsg = "服务器异常";
                            callback(result);
                            throw err;
                            return false;
                        });
                        return false;
                    }
                    let n_coupon = 1;
                    console.log(rowsf);
                    if(hasCoupon) {
                        n_coupon = rowsf.insertId;
                    }
                    let deDuctSql = "update wallet set balance = balance - ? where user_id = ?",
                    incomeSql = "update wallet set income = income + ? where user_id = ?",
                    deleteOccSql = "delete from occupied_table where occ_parking_unit_id = ?",
                    deleteReserSql = "delete from reservation where reserve_id = ?",
                    addHistorySql = "insert into parking_history(parking_unit_id,start_time,end_time," +
                                    "user_id,total,cost,u_coupon_id,n_coupon_id,has_read) values(?,?,?,?,?,?,?,?,0)";
                    let deDuctParams = [total, req.body.user],
                        deleteOccParams = [req.body.parkingUnitId],
                        incomeParams = [total, owner],
                        deleteReserParams = [reserve_id],
                        addHistoryParams = [req.body.parkingUnitId, startTime, now, req.body.user, total, cost, couponId, n_coupon];
                    let sqlEntities = [
                        {
                            sql: incomeSql,
                            params: incomeParams
                        },
                        {
                            sql: addHistorySql,
                            params: addHistoryParams
                        },
                        {
                            sql: deleteOccSql,
                            params: deleteOccParams
                        },
                        {
                            sql: deleteReserSql,
                            params: deleteReserParams
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
                    if(hasCoupon) {
                        sqlEntities.push({sql:deDuctSql,params:deDuctParams});
                    }
                    let transArr = [];
                    sqlEntities.forEach((sql_param) => {
                        let temp = function (cb) {
                            let sql = sql_param.sql;
                            let param = sql_param.params;
                            console.log("shiwucaozu");
                            connection.query(sql, param, (tErr, rows, fields) => {
                                if (tErr) {
                                    connection.rollback(() => {
                                        console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                                        return cb(tErr, null);
                                    });
                                } else {
                                    return cb(null, rows);
                                }
                            })
                        };
                        transArr.push(temp);
                    });
                    async.series(transArr, (err, asyncRes) => {
                        if(err) {
                            connection.rollback((err) => {
                                console.log("transaction error: " + err);
                                connection.release();
                                result.code = "0";
                                result.errMsg = "服务器异常";
                                callback(result);
                                return false;
                            });
                        }
                        else {
                            connection.commit((err, info) => {
                                console.log("transaction info: " + JSON.stringify(asyncRes));
                                if (err) {
                                    connection.rollback((err) => {
                                        console.log("transaction error: " + err);
                                        connection.release();
                                        result.code = "0";
                                        result.errMsg = "服务器异常";
                                       callback(result);
                                        return false;
                                    });
                                } else {
                                    result.errMsg = "endparking successfully";
                                    result.code = "200";
                                    result.historyId = asyncRes[1].insertId;
                                    callback(result);
                                }
                            })
                        }
                    })
                })
                
            })
        })

    })
}
module.exports = endPark;