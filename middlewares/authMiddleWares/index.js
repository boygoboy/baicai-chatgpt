// //导入 用户的模型
// const UserModel = require('../../models/UserModel');
// const isExistUser=(req,res,next)=>{
//     UserModel.findOne({username: req.body.username}, (err, data) => {
//         if(err){
//             return res.json({
//                 code: '500',
//                 msg: '系统出错',
//                 data: {}
//               })
//         }
//         if(data){
//             return res.json({
//                 code: '201',
//                 msg: '用户名已存在',
//                 data: {}
//               })
//         }
//         next()
//     })
// }

// module.exports = {
//     isExistUser
// }