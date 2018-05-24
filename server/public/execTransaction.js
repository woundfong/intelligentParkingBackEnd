const mysql = require('mysql');
const async = require("async");
const db = require('../../config/db');
const pool = mysql.createPool(db.mysql);
 
function execTrans(sqlEntities, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      return callback(err, null);
    }
    connection.beginTransaction((err) => {
      if (err) {
        return callback(err, null);
      }
      let transArr = [];
      sqlEntities.forEach((sql_param) => {
        let temp = function (cb) {
          let sql = sql_param.sql;
          let param = sql_param.params;
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
 
      async.series(transArr, (err, result) => {
        console.log("transaction error: " + err);
        if (err) {
          connection.rollback((err) => {
            console.log("transaction error: " + err);
            connection.release();
            return callback(err, null);
          });
        } else {
          connection.commit((err, info) => {
            console.log("transaction info: " + JSON.stringify(info));
            if (err) {
              console.log("执行事务失败，" + err);
              connection.rollback((err) => {
                console.log("transaction error: " + err);
                connection.release();
                return callback(err, null);
              });
            } else {
              connection.release();
              console.log('commit info ' + info);
              console.log('commit result ' + result);
              return callback(null, result);
            }
          })
        }
      })
    });
  });
}
 
module.exports = execTrans;