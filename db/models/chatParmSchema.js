// 用户表
const mongoose = require('mongoose');
const chatParamSchema =mongoose.Schema({
    "chatparamId": Number,
    "userId":{
        type:Number,
        required:true
    }, //用户id
    "channel": {      //聊天渠道
        type: String,
        required: true,
        enum:['官方','非官方']
    },
    "url":{
        type:String,
        default:''
    }, //接口地址
    "key":{
        type:Array,
        required:true
    },  //接口key
    "model":{
        type:String,
        required:true,
        default:'gpt-3.5-turbo'
    }, //模型
    "enablecontext":{
        type:Boolean,
        default:false //是否开启上下文
    },
    "proxytype":{
        type:String,
        default:'socks5'
    }, //代理类型
    "proxyurl":{
        type:String,
        default:''
    }, //代理地址
})
const chatparam = mongoose.model('chatparam',chatParamSchema,'chatparam')
module.exports = chatparam