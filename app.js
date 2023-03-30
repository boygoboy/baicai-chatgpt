var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const md5 = require('md5');
const {secret}=require('./config/config')
const cors = require('cors')
const checkTokenMiddleware=require('./middlewares/checkTokenMiddleware')

const chagptapi=require('./routes/api/chatgpt')
const user = require('./routes/api/user')
const role = require('./routes/api/role')
const menus=require('./routes/api/menus')

//导入配置项
const {createFirstUser} = require("./controller/systemModule/user")
createFirstUser({
  username:process.env.ADMIN_NAME || 'admin',
  password: md5(process.env.ADMIN_PASSWORD + md5(secret)) || '123456',
  role:0
})
// '/api/user'
var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(checkTokenMiddleware)

app.use('/api/chatgpt',chagptapi)
app.use('/api/user',user)
app.use('/api/role',role)
app.use('/api/menus',menus)
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
