var express = require('express');
var router = express.Router();
const { sendEmailCode ,checkIsUser} = require('../../controller/authClass/email')
//导入 邮箱模型
const Email = require('../../db/models/emailSchema');

router.post('/emailcode', (req, res) => {
     sendEmailCode(req,res)
})

router.post('/hasuser',(req,res)=>{
     checkIsUser(req,res)
})


module.exports = router;
