var express = require('express');
var qs = require('querystring');  
var router = express.Router();
var setting = require('../config/setting');
var my_http = require('./myHttp');

router.get('/', (req, resp, next) => {
    var param = req.query;
    param.key = setting.key;
    var options = {
        hostname: setting.mapApiHostname,
        path: "/ws/geocoder/v1/?" + qs.stringify(param),
        method: 'GET'
    };
    my_http.get(options, resp);
})

module.exports = router;