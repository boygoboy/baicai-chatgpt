const mongoose = require('mongoose')
const gptAccountSchema = mongoose.Schema({
    gptaccountId: Number,
    accounttype:{
        type:String,
        required:true,
        enum:['免费账号','升级账号','plus账号','bing账号']
    },
    accountemail:String,
    accountpassword:String,
    accountsession:String,
    accesstoken:String,
    apikey:String,
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
     isenable:{
        type:Boolean,
        default:true
     },
     accountstatus:{
        type:String,
        required:true,
        // enum:['启用','禁用','警告','失效']
    },
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
     keyList:{
        type:[],
     }
})

module.exports = mongoose.model("gptaccount", gptAccountSchema, "gptaccount")