const mongoose = require('mongoose')
const interfacePriceSchema = mongoose.Schema({
    interfacePriceId: Number,
    roleId: String,
    type:{
        type:String,
        required:true,
    },
    model:String,
    count:Number,
    unit:String,
})

module.exports = mongoose.model("interfacePriceSchema", interfacePriceSchema, "interfacePriceSchema")