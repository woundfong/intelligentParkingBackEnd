var express = require('express');
var http = require('http');
var qs = require('querystring');  
var setting = require('../config/setting');
var router = express.Router();

router.get('/', (request, resp, next) => {
    var param = request.query;
    param.key = setting.key;
    param.policy = setting.policy;
    var options = {
        hostname: "apis.map.qq.com",
        path: "/ws/direction/v1/driving/?" + qs.stringify(param),
        method: 'GET'
    };
    var req = http.request(options, res => {
        var data = "";
        res.on('data', (chunk)=>{
            data += chunk;
        });
        res.on('end', ()=>{
            resp.json(JSON.parse(data));
        })
    });
    req.on('error', error => {
        console.log('error: ' + error.message);
    });
    req.end();
});

module.exports = router;
