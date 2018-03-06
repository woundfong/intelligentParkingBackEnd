var mysql = require('mysql');
var db = require('../config/db');
//var pool = mysql.createPool(db.mysql);
var pool;
var mysqlPool = {
    createPool: function() {
        pool = mysql.createPool(db.mysql);
        return pool;
    },
    endPool: function(callback) {
        pool.end((err) => {
            callback(err);
        })
    }
}
module.exports = mysqlPool;