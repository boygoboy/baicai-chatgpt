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
    bardToken:String
})
const keyunofficalschema = mongoose.model('keyUnOfficalSchema',keyUnOfficalSchema,'keyUnOfficalSchema')
module.exports = keyunofficalschema