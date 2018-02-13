var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../config/db');
var pool = mysql.createPool(db.mysql);

var SQL = {
    query_users: 'select * from users where id = ?',
    query_master: 'select * from master where id = ?'
}

router.get('/', (req, res, next) => {
    var result = {};
    var account = req.query.account;
    pool.getConnection((err, connection) => {
        connection.query(SQL.query_master, [account], (err, queryResult) => {
            if(err) {
                result.msg = "error: " + err.sqlMessage;
                result.code = '0';
                res.json(result);
                console.log("mysql error: " + err.sqlMessage);
            }else {
                result.msg = "query successfully";
                result.code = '200';
                if(queryResult.length <= 0) {
                    result.role = 'not_master';
                    res.json(result);
                }else {
                    result.role = 'master';
                    res.json(result);
                }
            }
        })
    })
})

module.exports = router;