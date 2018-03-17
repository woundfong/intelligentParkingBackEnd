let express = require('express');
let qs = require('querystring');  
let setting = require('../../config/setting');
let router = express.Router();
let my_http = require('../public/myHttp');

router.post('/', (req, resp, next) => {
    let param = req.body;
    param.appid = setting.appid;
    param.secret = setting.secret;
    param.grant_type = setting.grant_type;
    let options = {
        hostname: setting.loginApiHostname,
        path: "/sns/jscode2session?" + qs.stringify(param),
        method: 'GET',
        port: 443
    };
    my_http.https_get(options, (res) => {
        resp.json(res)
    });
});

module.exports = router;