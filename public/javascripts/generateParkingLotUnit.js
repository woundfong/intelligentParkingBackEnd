var mysql = require('mysql');
var db = require('../../config/db');
var pool = mysql.createPool(db.mysql);
var myHttp = require('../../server/public/myHttp');
var setting = require('../../config/setting');
var qs = require('querystring');  
function rnd(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
}

var sql = "INSERT INTO parking_unit(parking_unit_id, master_id, latitude, longitude, address, adcode)" +
    " VALUES(nextval('parking_unit'),?,?,?,?,?)"

function generateParkingUnit() {
    var count = 1, num = 200;
    pool.getConnection((err, connection) => {
        function insertParkingUnit() {
            var latitude = rnd(2290000, 2305000) / 100000;
            var longitude =  rnd(11327000, 11344000) / 100000;
            var param = {
                key: setting.key,
                location: latitude + "," + longitude
            }
            var options = {
                hostname: setting.mapApiHostname,
                path: "/ws/geocoder/v1/?" + qs.stringify(param),
                method: 'GET'
            };
            myHttp.get(options, res => {
                if(res.code == '200') {
                    var result = res.data;
                    var address = result.result.formatted_addresses.recommend,
                        adcode = result.result.ad_info.adcode;
                    connection.query(sql, [1, latitude, longitude, address, adcode], (err, result)=>{
                        if(result) {
                            console.log('success');
                        }else {
                            console.log('error  ' + err.sqlMessage)
                        }
                        
                    })
                    count++;
                    setTimeout(() => {
                        if(count <= num) {
                            insertParkingUnit();
                        } else {
                            connection.release();
                        }
                    }, 1001);
                    
                }
            })
            
        }
        insertParkingUnit();
        
    })
}

module.exports = generateParkingUnit;