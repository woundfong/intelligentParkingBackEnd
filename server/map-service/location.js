let express = require('express');
let qs = require('querystring');  
let router = express.Router();
let setting = require('../../config/setting');
let my_http = require('../public/myHttp');

router.get('/', (req, resp, next) => {
    let param = req.query;
    param.key = setting.key;
    let options = {
        hostname: setting.mapApiHostname,
        path: "/ws/geocoder/v1/?" + qs.stringify(param),
        method: 'GET'
    };
    my_http.get(options, (res) => {
        resp.json(res);
    });
})

module.exports = router;