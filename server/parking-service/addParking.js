const express = require('express');
const router = express.Router();
const mySqlQuery = require('../public/mySqlQuery');
const multer = require('multer');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/imgs/' + req.user)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
let upload = multer({storage: storage});
router.post('/', (req, res, next) => {
    console.log(req.body);
    let sql, params = [], result = {}, date = new Date(),
        address = req.body.address, remark = req.body.remark,
        latitude = req.body.latitude, longitude = req.body.longitude,
        owner_id = req.body.owner_id;
    sql = "insert into applying_list(apply_owner_id,type,remark,address,apply_date,latitude,longitude) values(?,?,?,?,?,?,?)";
    params = [owner_id, req.body.type, remark, address, date, latitude, longitude];
    mySqlQuery(sql, params, (err, queryResult) => {
        if(err) {
            result.errMsg = "服务器异常";
            result.code = "0";
            res.json(result);
            return false;
        }
        result.errMsg = "query successfully";
        result.code = "200";
        if(req.body.type == 'lot') {
            result.insertId = queryResult.insertId;
        }
        res.json(result);
    })
})
router.post('/upload', upload.single('material'), (req, res) => {
    res.json({code: 0});
})
module.exports = router;