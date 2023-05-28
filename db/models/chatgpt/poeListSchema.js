const mongoose = require('mongoose')
const poeListSchema = mongoose.Schema({
    poeListId: Number,
    type:String,
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

module.exports = mongoose.model("poeListSchema", poeListSchema, "poeListSchema")