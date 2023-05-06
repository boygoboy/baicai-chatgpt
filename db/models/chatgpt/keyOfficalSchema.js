// 用户表
const mongoose = require('mongoose');
const keyOfficalSchema =mongoose.Schema({
    "officalkeyId": Number,
    "userId":{
        type:Number,
        required:true
    }, //用户id
    "chatgpt3Key": {      //聊天渠道
        type: String,
        default:''
    },
    "chatgpt4Key":{
        type:String,
        default:''
    }, //模型
})
const keyofficalschema = mongoose.model('keyOfficalSchema',keyOfficalSchema,'keyOfficalSchema')
module.exports = keyofficalschema