const mysql = require('mysql');
const db = require('../../config/db');
const pool = mysql.createPool(db.mysql);
const myHttp = require('../../server/public/myHttp');
const setting = require('../../config/setting');
const qs = require('querystring');  
function rnd(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
}

// let sql = {
//     insert_parkingLot: 'INSERT INTO parking_lot(pos_num, free_num, master_id, latitude, longitude, chart_id) VALUES(?,?,?,?,?,?)',
//     insert_prakingUnit: 'INSERT INTO parking_unit(master_id, latitude, longitude) VALUES(?,?,?)'
// }
let sql = "INSERT INTO parking_unit(parking_unit_id, master_id, latitude, longitude, address, adcode, remark, create_time)" +
    " VALUES(nextval('parking_unit'),?,?,?,?,?,?,?)"

function generateParkingUnit() {
    let num = 1;
    pool.getConnection((err, connection) => {
        function insertParkingUnit() {
            let latitude = rnd(2290000, 2305000) / 100000;
            let longitude =  rnd(11327000, 11344000) / 100000;
            let remark = "Auto-Generated"
            let param = {
                key: setting.key,
                location: latitude + "," + longitude
            }
            let options = {
                hostname: setting.mapApiHostname,
                path: "/ws/geocoder/v1/?" + qs.stringify(param),
                method: 'GET'
            };
            myHttp.get(options, res => {
                if(res.code == '200') {
                    let result = res.data;
                    let address = result.result.formatted_addresses.recommend,
                        adcode = result.result.ad_info.adcode;
                    let date = new Date();
                    connection.query(sql, [1, latitude, longitude, address, adcode, remark, date], (err, result)=>{
                        if(result) {
                            console.log('success');
                        }else {
                            console.log('error  ' + err.sqlMessage)
                        }
                        
                    })
                    num++;
                    setTimeout(() => {
                        if(num <= 200) {
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