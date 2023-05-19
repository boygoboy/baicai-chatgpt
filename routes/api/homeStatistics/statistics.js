const express = require('express');
const router = express.Router();
const {statisticsChatInfo,getChatDetail}=require('../../../controller/homeStatistics/statisticsChat.js')
router.get('/chatStatistics',(req,res)=>{
    statisticsChatInfo(req,res)
})
router.get('/chatdetaildata',(req,res)=>{
    getChatDetail(req,res)
})

module.exports = router;
