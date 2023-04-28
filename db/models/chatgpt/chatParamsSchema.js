// 用户表
const mongoose = require('mongoose');
const chatParamsSchema =mongoose.Schema({
    "chatparamId": Number,
    "userId":{
        type:Number,
        required:true
    }, //用户id
    "chatchannel": {      //聊天渠道
        type: String,
        required: true,
    },
    "model":{
        type:String,
        required:true,
        default:''
    }, //模型
    "url":{
        type:String,
        default:''
    }, //接口地址
    "enablecontext":{
        type:Boolean,
        default:false //是否开启上下文
    },
    "proxyObj":{
       proxytype:String,
       ip:String,
       port:Number,
       username:String,
       password:String
    }, //代理地址
})
const chatparam = mongoose.model('chatparams',chatParamsSchema,'chatparams')
module.exports = chatparam