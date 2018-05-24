#!/usr/bin/env node

/**
 * Module dependencies.
 */

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
//let index = require('./routes/index');
//let users = require('./routes/users');
let login = require('./server/auth-service/login');
let ownerLogin = require('./server/auth-service/ownerLogin');
let app = express();
const debug = require('debug')('intelligentparkingbackend:server');
const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const endPark = require("./server/parking-service/end");
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "ipark",
  cookie: {maxAge: 300000},
  resave: false,
  saveUninitialized: false
}))
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/login', login);
app.use('/ownerLogin', ownerLogin);
let api = require('./server/api');
// app.use('/api', (req, res, next) => {
//   if(!req.session.iparkUser) {
//     res.json({
//       code: 100,
//       errMsg: "you need to login"
//     })
//   } else {
//     next();
//   }
//   // if(req.get("Authorization") != "wx.huanfeng.site") {
//   //   res.send("Without Authorization!")
//   // } else {
//   //   next();
//   // }
// })
app.use('/api', api);
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', index);


/**
 * Get port from environment and store in Express.
 */
//var port = normalizePort(process.env.PORT || '2000');

let clients = {}, locks = {};
let verifyClient = function(info) {
  console.log(info.req.session)
  if(info.req.headers.authorization != "wx.huanfeng.site") {
    return false;
  }
  return true;
}

app.post('/autoEnd', (req, res, next) => {
  console.log(req.body)
  let parkingUnitId = req.body.parkingUnitId;
  let user = clients[parkingUnitId].user;
  console.log(user);
  endPark({body:{user:user, parkingUnitId: parkingUnitId}}, (result) => {
    if(result.code == "200") {
      let ws = clients[parkingUnitId].ws;
      var obj = {status: 0, historyId: result.historyId};
      obj = JSON.stringify(obj);
      ws.send(obj);
    }
    res.json(result)
  })
})
/**
 * Create HTTP server.
 */
app.get('/', (req, res) => {
  console.log("66666666")
  if(!req.session.iparkUser) {
    console.log("no user");
    res.sendFile(path.join(__dirname, 'public/index.html'))
  } else {
    console.log(req.session.iparkUser);
    console.log(req.cookies);
    if(req.session.iparkUser == req.cookies.iparkUser) {
      res.sendFile(path.join(__dirname, 'public/iparkAdminConsole.html'))
    } else {
      res.send("invalid user");
    }
  }
});
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var port = normalizePort('2000');
app.set('port', port);
var server = http.createServer(app);
const wss = new WebSocket.Server({
  server: server,
  verifyClient: verifyClient
});
/**
 * Listen on provided port, on all network interfaces.
 */
function heartbeat(buffer) {
  console.log(buffer.toString())
  this.isAlive = true;
}
wss.on('connection', function connection(ws, req) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  let location = url.parse(req.url, true);
  let parkingUnitId = location.query.parkingUnitId, type = location.query.type;
  console.log(location.query);
  if(type == "client") {
    clients[parkingUnitId] = {};
    clients[parkingUnitId].ws = ws;
    clients[parkingUnitId].user = location.query.user;
    ws.on('message', function incoming(message) {
      console.log('received from client: %s', message);
    });
    ws.send("Hello World");
  } else if(type == "lock") {
    locks[parkingUnitId] = ws;
    ws.on('message', function incoming(message) {
      console.log('received from lock: %s', message);
      if(message.status == 0) {
        let options = {
          port: 2000,
          method: "POST",
          path: "/api/parking?user=" + clients[parkingUnitId].user + "&parkingUnitId=" + parkingUnitId,
          auth: "wx.huanfeng.site"
        }
        let httpReq = http.request(options, res => {
          let data = "";
          res.on('data', (chunk)=>{
              data += chunk;
          });
          res.on('end', ()=>{
            console.log(JSON.parse(data));
            //callback(result);   websocket.send(data[, options][, callback]) data:any, options: Object, callback: Function
          })
        })
        httpReq.on('error', error => {
            throw error;
        });
        httpReq.end();
      }
      
    });
  }
  
  ws.on("close", (code, reason) => {
    console.log("-----------------------------websocket close----------------------------" + reason);
    if(type == "client") {
      delete clients[parkingUnitId]
    }
  })
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping("ping"); //每隔一段时间检测是否有已失效的connection
    ws.send("ping"); //发送心跳包
  });
}, 540000);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log("listening at port 2000");
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
