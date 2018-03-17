let http = require('http');
let https = require('https');

let my_http = {
    get: (options, callback) => {
        let result = {};
        let req = http.request(options, res => {
            let data = "";
            res.on('data', (chunk)=>{
                data += chunk;
            });
            res.on('end', ()=>{
                result.code = '200';
                result.data = JSON.parse(data);
                callback(result);
            })
        });
        req.on('error', error => {
            result.code = '0';
            result.data = error.message;
            callback(result);
        });
        req.end();
    },
    https_get: (options, callback) => {
        let result = {};
        let req = https.request(options, res => {
            let data = "";
            res.on('data', (chunk)=>{
                data += chunk;
            });
            res.on('end', ()=>{
                result.code = '200';
                result.data = JSON.parse(data);
                callback(result);
            })
        });
        req.on('error', error => {
            result.code = '0';
            result.data = error.message;
            callback(result);
        });
        req.end();
    }
}

module.exports = my_http;