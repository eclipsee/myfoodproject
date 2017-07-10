var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
var supply = require('./routes/supply');
var logs = require('./routes/logs');
var unit = require('./routes/unit');
var foodclasslist = require('./routes/foodclasslist');
var foodlist = require('./routes/foodlist');
var stockplan = require('./routes/stockplan');
var boundin = require('./routes/boundin');
var boundout = require('./routes/boundout');
var ghsend = require('./routes/ghsend');
var ghreceive = require('./routes/ghreceive');
var cwreceive = require('./routes/cwreceive');
var cwpay = require('./routes/cwpay');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/supply', supply);
app.use('/logs', logs);
app.use('/unit', unit);
app.use('/foodclasslist', foodclasslist);
app.use('/foodlist', foodlist);
app.use('/stockplan', stockplan);
app.use('/boundin', boundin);
app.use('/boundout', boundout);
app.use('/ghsend', ghsend);
app.use('/ghreceive', ghreceive);
app.use('/cwreceive', cwreceive);
app.use('/cwpay', cwpay);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
