const mongoose = require('mongoose')
const claudeListSchema = mongoose.Schema({
    claudeListId: Number,
    type:String,
    email:String,
    password:String,
    token:String,
    appid:String,
    enablestatus:{
        type:String,
        default:'启用'
    },
    tokenstatus:String,
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
})

module.exports = mongoose.model("claudeListSchema", claudeListSchema, "claudeListSchema")