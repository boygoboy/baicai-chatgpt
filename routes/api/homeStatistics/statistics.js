const express = require('express');
const router = express.Router();
const {statisticsChatInfo}=require('../../../controller/homeStatistics/statisticsChat.js')

router.get('/chatStatistics',(req,res)=>{
    statisticsChatInfo(req,res)
})

module.exports = router;
