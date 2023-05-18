const mongoose = require('mongoose')
const requestCountSchema = mongoose.Schema({
    userId: Number,
    type:{
        type:String,
        required:true,
    },
    model:String,
    messageCount: {
      type: Number,
      default: 0
    },
    resetTime: {
      type: Date,
      default: Date.now()
    }
})

module.exports = mongoose.model("requestCountSchema", requestCountSchema, "requestCountSchema")