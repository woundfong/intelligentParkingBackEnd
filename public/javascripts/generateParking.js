var mysql = require('mysql');
var db = require('../../config/db');
var pool = mysql.createPool(db.mysql);

function rnd(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
}

var SQL = {
    insert_parkingLot: 'INSERT INTO parking_lot(pos_num, free_num, master_id, latitude, longitude, chart_id) VALUES(?,?,?,?,?,?)',
    insert_prakingUnit: 'INSERT INTO parking_unit(master_id, latitude, longitude) VALUES(?,?,?)'
}

function generateParkingLots() {
    var num = 100;
    pool.getConnection((err, connection) => {
        for(var i = 0; i < num; i++) {
            var latitude = rnd(2290000, 2305000) / 100000;
            var longitude =  rnd(11327000, 11344000) / 100000;
            
            connection.query(SQL.insert_parkingLot, [20, 20, 1, latitude, longitude, 1], (err, result)=>{
                if(result) {
                    console.log('success');
                }else {
                    console.log('error  ' + err.sqlMessage)
                }
                
            })
        }
        connection.release();
    })
}

module.exports = generateParkingLots;