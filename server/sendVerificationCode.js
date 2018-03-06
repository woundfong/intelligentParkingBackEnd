/**
 * Created on 2017-07-31
 */
var setting = require('../config/setting');
var generateVerificationCode = require('./generateVerificationCode');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../config/db');
var pool = mysql.createPool(db.mysql);
var getDate = require('./getDate');
var SQL = "insert into verify_table(phone_num, start_time, code) values(?, ?, ?)";

const SMSClient = require('@alicloud/sms-sdk')
const accessKeyId = setting.aliAccessKeyId;
const secretAccessKey = setting.aliSecretAccessKey;
const templateCode = setting.aliTemplateCode;
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})

router.get('/', (req, res, next) => {
    var code = generateVerificationCode();
    var phoneNum = req.query.phoneNum;
    var templateParamJson = {
        "code": code
    }
    var templateParam = JSON.stringify(templateParamJson);
    var result = {};
    pool.getConnection((err, connection) => {
        connection.beginTransaction(err => {
            if(err) {
                result.code = '0';
                result.errMsg = "服务器异常";
                res.json(result);
                throw err;
            }
            var start_time = getDate.getNowFormat("yyyy-MM-dd hh:mm:ss");
            connection.query(SQL, [phoneNum, start_time, code], (err, queryResult) => {
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
                        var code = resp.Code;
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