/**
 * Created on 2017-07-31
 */
let setting = require('../../config/setting');
let generateVerificationCode = require('./generateVerificationCode');
let express = require('express');
let router = express.Router();
let mysql = require('mysql');
let db = require('../../config/db');
let pool = mysql.createPool(db.mysql);
let getDate = require('../public/getDate');
let sql = "insert into verify_table(phone_num, start_time, code) values(?, ?, ?)";

const SMSClient = require('@alicloud/sms-sdk')
const accessKeyId = setting.aliAccessKeyId;
const secretAccessKey = setting.aliSecretAccessKey;
const templateCode = setting.aliTemplateCode;
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})

router.post('/', (req, res, next) => {
    let code = generateVerificationCode();
    let phoneNum = req.body.phoneNum;
    let templateParamJson = {
        "code": code
    }
    let templateParam = JSON.stringify(templateParamJson);
    let result = {};
    pool.getConnection((err, connection) => {
        connection.beginTransaction(err => {
            if(err) {
                result.code = '0';
                result.errMsg = "服务器异常";
                res.json(result);
                throw err;
            }
            let start_time = getDate.getNowFormat("yyyy-MM-dd hh:mm:ss");
            connection.query(sql, [phoneNum, start_time, code], (err, queryResult) => {
                if(err) {
                    result.code = '0';
                    result.errMsg = "服务器异常";
                    res.json(result);
                    throw err;
                }
                connection.commit(err => {
                    if(err) {
                        connection.rollback(() => {
                            result.code = '0';
                            result.errMsg = "服务器异常";
                            res.json(result);
                            throw err;
                        })
                    }
                    //发送短信
                    smsClient.sendSMS({
                        PhoneNumbers: phoneNum,
                        SignName: '周焕丰的共享系统',
                        TemplateCode: templateCode,
                        TemplateParam: templateParam
                    }).then(function (resp) {
                        console.log(resp)
                        let code = resp.Code;
                        if (code === 'OK') {
                            result.errMsg = "send successfully";
                            result.code = '200';
                            res.json(result);
                        }
                    }, function (err) {
                        connection.rollback(() => {
                            result.code = '0';
                            result.errMsg = err;
                            res.json(result);
                            throw err;
                        })
                    })
                })
            })
        })
        
        connection.release();
    })
    
})
module.exports = router;