const mongoose = require('mongoose')
const interfaceRateSchema = mongoose.Schema({
    interfaceRateId: Number,
    roleId: String,
    type:{
        type:String,
        required:true,
    },
    model:String,
    count:Number,
    cycle:Number,
    unit:String,
})

module.exports = mongoose.model("interfaceRateSchema", interfaceRateSchema, "interfaceRateSchema")