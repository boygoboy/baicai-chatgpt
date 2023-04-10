// 用户表
const mongoose = require('mongoose');
const modelParamSchema =mongoose.Schema({
    "modelparamId": Number,
    "userId":{
        type:Number,
        required:true
    }, //用户id
    "model":{  //模型
        type:String,
        required:true
    },
    "parameter":{  //参数
        type:String,
        required:true
    },
    "value":{  //值
        type:Number,
        required:true
    },
    "description":String, //描述
    "type":{ //值类型
        type:String,
        required:true
    },
    "range":{ //值范围
        type:String,
        required:true
    }
})
const modelparam = mongoose.model('modelparam',modelParamSchema,'modelparam')
module.exports = modelparam