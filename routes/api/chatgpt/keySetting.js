const express = require('express');
const router = express.Router();
const {getOfficalKeys,postOfficalKeys,getUnofficalKeys,postUnofficalKeys,
getOfficalKeyList}=require('../../../controller/chatGpt/keySetting.js')


router.get("/officalkeysetting", (req, res) => {
    getOfficalKeys(req,res)
})

router.post("/officalkeysetting", (req, res) => {
    postOfficalKeys(req,res)
})

router.get("/officalkeylist",(req,res)=>{
    getOfficalKeyList(req,res)
})

router.get("/unofficalkeysetting", (req, res) => {
    getUnofficalKeys(req,res)
})

router.post("/unofficalkeysetting", (req, res) => {
    postUnofficalKeys(req,res)
})



module.exports = router;