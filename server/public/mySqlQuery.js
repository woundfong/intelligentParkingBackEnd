let mysql = require('mysql');
let db = require('../../config/db');
//let mysqlPool = require('./mysqlPool');
let query = function(sql, params, callback) {
    let pool = mysql.createPool(db.mysql);
    pool.getConnection((err, connection) => {
        if(err) {
            callback(err, null);
        } else {
            let q = connection.query(sql, params, (err, queryResult) => {
                connection.release();
                callback(err, queryResult);
            })
            console.log(q.sql)
        }
    })
}

module.exports = query;