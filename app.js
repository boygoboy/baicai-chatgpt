var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const authApiRouter = require('./routes/api/auth');
//导入 account 接口路由文件
const accountRouter = require('./routes/api/account');
const chagptapi=require('./routes/api/chatgpt')
//导入 express-session 
const session = require("express-session");
const MongoStore = require('connect-mongo');
//导入配置项
const {DBHOST, DBPORT, DBNAME} = require('./config/config');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', accountRouter);
app.use('/api', authApiRouter);
app.use('/api',chagptapi)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //响应 404 
  res.render('404');
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
