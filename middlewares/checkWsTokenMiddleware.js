//导入 jwt
const jwt = require('jsonwebtoken');
const { ConnectionStates } = require('mongoose');
//读取配置项
const {secret} = require('../config/config');

//声明中间件
module.exports = (ws, req, next) => {

  //获取 token
  let token = req.query.token;
  //判断
  if (!token) {
    return ws.send('缺少token!')
  }
  //校验 token
  jwt.verify(token, secret, async (err, data) => {
    //检测 token 是否正确
    if (err) {
      return ws.send('token校验失败!')
    }
    //保存用户的信息
    req.user = data; // req.session  req.body
    next();
  });
}