const mongoose = require('mongoose')
const conversationStatisticsSchema = mongoose.Schema({
    statisticsId: Number,
    userId:Number,
    type: String,
    model:String,
    count:Number,
    date:Date
})

module.exports = mongoose.model("conversationStatisticsSchema", conversationStatisticsSchema, "conversationStatisticsSchema")