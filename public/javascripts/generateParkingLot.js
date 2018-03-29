let mysql = require('mysql');
let db = require('../../config/db');
let pool = mysql.createPool(db.mysql);
let myHttp = require('../../server/public/myHttp');
let setting = require('../../config/setting');
let qs = require('querystring');  
function rnd(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
}

// let sql = {
//     insert_parkingLot: 'INSERT INTO parking_lot(pos_num, free_num, master_id, latitude, longitude, chart_id) VALUES(?,?,?,?,?,?)',
//     insert_prakingUnit: 'INSERT INTO parking_unit(master_id, latitude, longitude) VALUES(?,?,?)'
// }
let sql = "INSERT INTO parking_lot(pos_num, free_num, master_id, latitude, longitude, chart_id, address, remark, create_time)" +
    " VALUES(?,?,?,?,?,?,?,?,?)";

function generateParkingLots() {
    let count = 1, num = 198;
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            return false;
        }
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
                if(res.code == "200") {
                    let result = res.data;
                    let address = result.result.formatted_addresses.recommend;
                    let date = new Date();
                    connection.query(sql, [0, 0, 1, latitude, longitude, 0, address, remark, date], (err, result)=>{
                        if(result) {
                            console.log('success ' + count);
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

module.exports = generateParkingLots;