//导入 jwt
const jwt = require('jsonwebtoken');
const { ConnectionStates } = require('mongoose');
//读取配置项
const {secret} = require('../config/config');
const excludeRoutes = ['/api/user/login','/api/chatgpt/ask'];
const {checkWhiteListRouter}=require('../utils/checkWhiteListRouter')
//声明中间件
module.exports = (req, res, next) => {
  if (excludeRoutes.includes(req.path)) {
    return next(); // 如果请求路径在排除列表中，直接传递给下一个中间件
  }
  //获取 token
  let token = req.get('token');
  //判断
  if (!token) {
    return res.json({
      errorCode: '401',
      msg: 'token 缺失',
      data: null
    })
  }
  //校验 token
  jwt.verify(token, secret, async (err, data) => {
    //检测 token 是否正确
    if (err) {
      return res.json({
        errorCode: '401',
        message: 'token 校验失败!',
        data: null
      })
    }
    //保存用户的信息
    req.user = data; // req.session  req.body
    //如果 token 校验成功
    console.log("---------------------")
    let whiteList=await checkWhiteListRouter(req,res)
   if(! whiteList.filter(item=>req.path.startsWith(item))){
    return res.json({
      errorCode: '401',
      message: '没有权限',
      data: null
    })
   }

    next();
  });
}