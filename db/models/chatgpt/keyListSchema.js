const mongoose = require('mongoose')
const keyListSchema = mongoose.Schema({
    keyListId: Number,
    type:{
        type:String,
        required:true,
    },
    email:String,
    password:String,
    key:String,
    sharecount:Number,
    usedcount:{
        type:Number,
        default:0
    },
    shareroles:{
        type:[],
    },
    shareroleNames:{
        type:[],
    },
    endtime:{
        type:Date,
        default:null
    },
     keystatus:{
        type:String,
        required:true,
        // enum:['启用','禁用','失效']
    },
    isenable:Boolean,
     quota:Number,  //账号额度
     consumption:{  //消费金额
        type:Number,
        default:0
     },
     balance:{  //账号余额
        type:Number,
     },
     history_usage:{
         type:[]
     },
})

module.exports = mongoose.model("keyListSchema", keyListSchema, "keyListSchema")