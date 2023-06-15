//导入 jwt
const jwt = require('jsonwebtoken');
const { ConnectionStates } = require('mongoose');
//读取配置项
const {secret} = require('../config/config');
const excludeRoutes = ['/api/user/login','/api/chatgpt/ask',
'/api/auth/emailcode','/api/user/register','/api/auth/hasuser',
'/api/chatgpt/login/token','/api/chatgpt/login/session',
'/api/jiyan/gettype','/api/jiyan/getphp',
'/api/jiyan/ajax1php','/api/jiyan/getlastphp','/api/jiyan/slidetrack','/api/jiyan/checkslide'
];
const {checkWhiteListRouter}=require('../utils/checkWhiteListRouter')
//声明中间件
module.exports = (req, res, next) => {
  console.log(req.path)
  console.log(excludeRoutes.includes(req.path))
  if (excludeRoutes.includes(req.path)) {
    return next(); // 如果请求路径在排除列表中，直接传递给下一个中间件
  }
  //获取 token
  let token = req.get('token');
  //判断
  if (!token) {
    return res.json({
      errorCode: '401',
      message: 'token 缺失',
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
    // 说明是超级管理员有所有路由权限
    if(data.userList.role==0){
      return next()
    }
    //如果 token 校验成功
    console.log("---------------------")
    let whiteList=await checkWhiteListRouter(req,res)
   if(whiteList.filter(item=>req.path.startsWith(item)).length==0){
    return res.json({
      errorCode: '401',
      message: '没有权限',
      data: null
    })
   }

    next();
  });
}