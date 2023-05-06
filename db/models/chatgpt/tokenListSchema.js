const mongoose = require('mongoose')
const tokenListSchema = mongoose.Schema({
    tokenListId: Number,
    type:{
        type:String,
        required:true,
    },
    email:String,
    password:String,
    token:String,
    session:String,
    tokenstatus:String,
    sessionstatus:String,
    enablestatus:{
        type:String,
        default:'启用'
    },
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

module.exports = mongoose.model("tokenListSchema", tokenListSchema, "tokenListSchema")