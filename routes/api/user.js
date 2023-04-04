const { login, userlist, addlist,updatelist, dellist,isactiveuser,registerUser} = require("../../controller/systemModule/user")
var express = require('express');
var router = express.Router();
const authEmailCode=require('../../middlewares/authEmailCodeMiddleWares')

router.post('/login',  (req, res) => {
    login(req,res)
})

router.get('/userlist', (req,res) => {
    userlist(req,res)
})
//管理员新增
router.post('/addlist',  (req,res) => {
     addlist(req,res)
})
// 用户注册
router.post('/register',authEmailCode, (req, res) => {
    registerUser(req,res)
})

// 编辑
router.put('/updatelist',  (req, res) => {
     updatelist(req,res)
})

//删除
router.delete('/dellist/:id',  (req, res) => {
     dellist(req, res)
})
// 禁用or启用用户
router.put('/isactiveuser', (req,res)=>{
    isactiveuser(req,res)
})

module.exports = router