const mongoose = require('mongoose')
const xfyunListSchema = mongoose.Schema({
    xfyunListId: Number,
    email:String,
    password:String,
    token:String,
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

module.exports = mongoose.model("xfyunListSchema", xfyunListSchema, "xfyunListSchema")