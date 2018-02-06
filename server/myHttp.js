var http = require('http');
var https = require('https');

var my_http = {
    get: (options, resp) => {
        var result = {};
        var req = http.request(options, res => {
            var data = "";
            res.on('data', (chunk)=>{
                data += chunk;
            });
            res.on('end', ()=>{
                result.code = '200';
                result.data = JSON.parse(data);
                resp.json(result);
            })
        });
        req.on('error', error => {
            result.code = '0';
            result.data = error.message;
            resp.json(result);
        });
        req.end();
    },
    https_get: (options, resp) => {
        var result = {};
        var req = https.request(options, res => {
            var data = "";
            res.on('data', (chunk)=>{
                data += chunk;
            });
            res.on('end', ()=>{
                result.code = '200';
                result.data = JSON.parse(data);
                resp.json(result);
            })
        });
        req.on('error', error => {
            result.code = '0';
            result.data = error.message;
            resp.json(result);
        });
        req.end();
    }
}

module.exports = my_http;