var mysqlPool = require('./mysqlPool');
var query = function(sql, params, callback) {
    var pool = mysqlPool.createPool();
    pool.getConnection((err, connection) => {
        if(err) {
            callback(err, null);
        } else {
            connection.query(sql, params, (err, queryResult) => {
                callback(err, queryResult);
            })
            connection.release();
        }
    })
}

module.exports = query;