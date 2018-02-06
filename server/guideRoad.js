var express = require('express');
var qs = require('querystring');  
var setting = require('../config/setting');
var router = express.Router();
var my_http = require('./myHttp');

router.get('/', (request, resp, next) => {
    var param = request.query;
    param.key = setting.key;
    param.policy = setting.policy;
    var options = {
        hostname: setting.mapApiHostname,
        path: "/ws/direction/v1/driving/?" + qs.stringify(param),
        method: 'GET'
    };
    my_http.get(options, resp);
});

module.exports = router;
