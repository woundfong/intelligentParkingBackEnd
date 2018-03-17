let express = require('express');
let qs = require('querystring');  
let setting = require('../../config/setting');
let router = express.Router();
let my_http = require('../public/myHttp');

router.get('/', (request, resp, next) => {
    let param = request.query;
    param.key = setting.key;
    param.policy = setting.policy;
    let options = {
        hostname: setting.mapApiHostname,
        path: "/ws/direction/v1/driving/?" + qs.stringify(param),
        method: 'GET'
    };
    my_http.get(options, (res)=>{
        resp.json(res);
    });
});

module.exports = router;
