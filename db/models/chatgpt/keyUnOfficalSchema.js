// 用户表
const mongoose = require('mongoose');
const keyUnOfficalSchema =mongoose.Schema({
    "unofficalkeyId": Number,
    "userId":{
        type:Number,
        required:true
    }, //用户id
    "accesstoken3":{
        type:String,
        default:''
    }, //接口地址
    "accesstoken4":{
        type:String,
        default:''
    },
    newbingKey:{
        newbingtoken:String,
        newbingcookie:String
    },
    bardtoken:{
        type:String,
        default:''
    },
    claudeKey:{
        token:String,
        appid:String
    },
    huggingtoken:{
        type:String,
        default:''
    },
    xfyuntoken:{
        type:String,
        default:''
    },
    poetoken:{
        type:String,
        default:''
    },
    chatglmKey:{
        chatglmtoken:String,
        chatglmcookie:String
    },
})
const keyunofficalschema = mongoose.model('keyUnOfficalSchema',keyUnOfficalSchema,'keyUnOfficalSchema')
module.exports = keyunofficalschema