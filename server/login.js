var express = require('express');
var qs = require('querystring');  
var setting = require('../config/setting');
var router = express.Router();
var my_http = require('./myHttp');
var https = require('https');

router.get('/', (req, resp, next) => {
    var param = req.query;
    param.appid = setting.appid;
    param.secret = setting.secret;
    param.grant_type = setting.grant_type;
    var options = {
        hostname: setting.loginApiHostname,
        path: "/sns/jscode2session?" + qs.stringify(param),
        method: 'GET',
        port: 443
    };
    my_http.https_get(options, resp);
});

module.exports = router;