var createError = require('http-errors');
var express = require('express');
var expressWs = require('express-ws');
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
const auth =require('./routes/api/auth')
const chatParam=require('./routes/api/gptparam')
const gptAccount=require('./routes/api/account')
const gptChatParams=require('./routes/api/chatgpt/paramsSetting')
const keySetting=require('./routes/api/chatgpt/keySetting')
const KeyList=require('./routes/api/chatgpt/resourceManage')

//导入配置项
const {createFirstUser} = require("./controller/systemModule/user")
createFirstUser({
  username:process.env.ADMIN_NAME || 'admin',
  password: md5(process.env.ADMIN_PASSWORD + md5(secret)) || '123456',
  role:0
})
// '/api/user'
var app = express();
// 这里是websocket的路由要放在  之后
const chatgptWs=require('./routes/ws/chatgpt')

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//注意这里的ws路由注册需要放在httptoken认证前面，否则token对其无法验证，导致误拦截
app.use('/api/ws/chatgpt',chatgptWs)
app.use(checkTokenMiddleware)

app.use('/api/chatgpt',chagptapi)
app.use('/api/user',user)
app.use('/api/role',role)
app.use('/api/menus',menus)
app.use('/api/auth',auth)
app.use('/api/gptparam',chatParam)
app.use('/api/gptaccount',gptAccount)
app.use('/api/chatgpt',gptChatParams)
app.use('/api/chatgpt',keySetting)
app.use('/api/chatgpt',KeyList)
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
