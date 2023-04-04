var express = require('express');
var router = express.Router();
const { sendEmailCode } = require('../../controller/authClass/email')
//导入 邮箱模型
const Email = require('../../db/models/emailSchema');

router.post('/emailcode', (req, res) => {
     sendEmailCode(req,res)
})


module.exports = router;
