//维护自增表
const mongoose = require('mongoose')
const counterSchema = mongoose.Schema({
    "id":String,
    "sequence_value":Number
})
const counter = mongoose.model("counter",counterSchema)
module.exports = counter