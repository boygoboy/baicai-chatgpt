const Email=require('../db/models/emailSchema')

module.exports=async (req,res,next)=>{
    const vire = await Email.findOne({ email:req.body.userEmail, code:req.body.code }); // 检验验证码
    if(!vire){
        return res.json({
            errorCode: "2003",
            message:"邮箱验证码错误!",
            data:null
        })
    }
    next()
}