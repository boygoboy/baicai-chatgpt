const Counter = require('../../db/models/counterSchema')
const Email = require('../../db/models/emailSchema')
const nodemailer = require("nodemailer"); // 邮件发送模块
const smtpTransport = require("nodemailer-smtp-transport");
const sendEmailCode=async (req,res)=>{
    try{
   //    初始化邮箱配置
   const transport = nodemailer.createTransport(
    smtpTransport({
      host: "smtp.163.com", // 服务,这里使用的是163邮箱
      port: 465, // smtp端口，默认就是此 端口
      secure: true,
      auth: {
        user: "cwj16030301@163.com", //发件人邮箱，即你的邮箱
        pass: "ABQANKSBEKORUVMT", // SMTP授权码,需要邮箱设置中获取
      },
    })
  );
    // 生成6位随机数
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += parseInt(Math.random() * 10);
    }
   const regEmail =
    /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; //验证邮箱正则

  /* 发送验证码 */
  let EMAIL = req.body.email;
  if (regEmail.test(EMAIL)) {
    transport.sendMail(
      {
        from: "cwj16030301@163.com", // 发件邮箱
        to: EMAIL, // 收件列表
        subject: "验证你的电子邮件", // 标题
        html: `
          <p>你好！</p>
          <p>您正在注册baicai-gpt账号</p>
          <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
          <p>***该验证码10分钟内有效***</p>
          <p>如果您没有注册baicai-gpt账号，请忽略此邮件。</p>
          `, // html 内容
      },
      function (error, data) {
        if (error) {
          transport.close(); // 如果没用，关闭连接池
          return res.json({
            errorCode: "1002",
            message:"发送失败!"
          })
        }
      }
    );
  }else{
    return res.json({
        errorCode: "1002",
        message:"邮箱格式不正确!",
        data:null
    })
  }

   /* 存储验证码到数据库中 */
  const email = EMAIL;
  await Email.deleteMany({ email });
          //这一步运行一次就可以注释掉，自增需要有个初始值
          const result = await Counter.findOne({ id: "emailId" })
          if (!result) {
              await Counter.create({
                  "id": "emailId",
                  "sequence_value": 1
              })
          }
          //处理自增emailId
  const count = await Counter.findOneAndUpdate({ id: 'emailId' }, { $inc: { sequence_value: 1 } }, { new: true })
  const _email = await new Email({
    emailId: count.sequence_value,email,code
})
await _email.save();
  setTimeout(async () => {
    //10分钟后失效，即删除验证码
    await Email.deleteMany({ email });
  }, 1000 * 60 * 10);
  return res.json({
    errorCode: "0000",
    message:"验证码发送成功,请到邮箱查收！",
    data:null
  })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误！',
            data:error
        })
        throw error
    }
 
}

module.exports={
    sendEmailCode
}