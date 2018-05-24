/**
 * Created on 2017-07-31
 */
const setting = require('../../config/setting');
const generateVerificationCode = require('./generateVerificationCode');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../../config/db');
const pool = mysql.createPool(db.mysql);
let sql = "insert into msg_codes(phone_num, start_time, code) values(?, ?, ?)";

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
                result.code = "0";
                result.errMsg = "服务器异常";
                res.json(result);
                return false;
            }
            //let start_time = getDate.getNowFormat("yyyy-MM-dd hh:mm:ss");
            let start_time = new Date();
            connection.query(sql, [phoneNum, start_time, code], (err, queryResult) => {
                if(err) {
                    result.code = "0";
                    result.errMsg = "服务器异常";
                    res.json(result);
                    return false;
                }
                connection.commit(err => {
                    if(err) {
                        connection.rollback(() => {
                            result.code = "0";
                            result.errMsg = "服务器异常";
                            res.json(result);
                            return false;
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
                            result.code = "200";
                            res.json(result);
                        }
                    }, function (err) {
                        connection.rollback(() => {
                            result.code = "0";
                            result.errMsg = err;
                            console.log(err)
                            res.json(result);
                            return false;
                        })
                    })
                })
            })
        })
        
        connection.release();
    })
    
})
module.exports = router;