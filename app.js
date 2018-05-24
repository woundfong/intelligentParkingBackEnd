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

module.exports = app;
