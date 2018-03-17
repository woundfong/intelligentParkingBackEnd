let mysql = require('mysql');
let db = require('../../config/db');
//let pool = mysql.createPool(db.mysql);
let pool;
let mysqlPool = {
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