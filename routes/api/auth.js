var express = require('express');
var router = express.Router();
//导入 jwt
const jwt = require('jsonwebtoken');
//导入配置文件
const {secret} = require('../../config/config')
//导入 用户的模型
const UserModel = require('../../models/UserModel');
const md5 = require('md5');
const {isExistUser} = require('../../middlewares/authMiddleWares');

//注册用户
router.post('/register', isExistUser,(req, res) => {

  UserModel.create({...req.body, password: md5(req.body.password+md5(secret))}, (err, data) => {
    if(err){
      res.json({
        code:500,
        msg:'注册失败！',
        data:{}
      })
      return
    }
    res.json({
      code:200,
      msg:'注册成功！',
      data:{}
    })
  })
});


//登录操作
router.post('/login', (req, res) => {
  //获取用户名和密码
  let {username, password} = req.body;
  //查询数据库
  UserModel.findOne({username: username, password: md5(password+md5(secret))}, (err, data) => {
    //判断
    if(err){
      res.json({
        code: '2001',
        msg: '数据库读取失败!',
        data: null
      })
      return
    }
    //判断 data
    if(!data){
      return res.json({
        code: '2002',
        msg: '用户名或密码错误!',
        data: null
      })
    }
    
    //创建当前用户的 token
    let token = jwt.sign({
      username: data.username,
      _id: data._id
    }, secret, {
      expiresIn: 60 * 60 * 24
    });
    
    //响应 token
    res.json({
      code: '200',
      msg: '登录成功!',
      data: token
    })

  })

});

router.get('/info', (req, res) => {})


module.exports = router;
