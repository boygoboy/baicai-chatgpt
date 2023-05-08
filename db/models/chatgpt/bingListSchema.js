const mongoose = require('mongoose')
const bingListSchema = mongoose.Schema({
    bingListId: Number,
    email:String,
    password:String,
    token:String,
    cookie:String,
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

module.exports = mongoose.model("bingListSchema", bingListSchema, "bingListSchema")