const express = require('express');
const router = express.Router();
const {getOfficalKeys,postOfficalKeys,getUnofficalKeys,postUnofficalKeys,
getOfficalKeyList,getUnofficaltokenList,getBingTokenList,getBardUnofficalList,getClaudeTokenList}=require('../../../controller/chatGpt/keySetting.js')
router.get("/officalkeysetting", (req, res) => {
    getOfficalKeys(req,res)
})

router.post("/officalkeysetting", async(req, res) => {
        await postOfficalKeys(req, res);
})

router.get("/officalkeylist",(req,res)=>{
    getOfficalKeyList(req,res)
})

router.get("/unofficalkeysetting", (req, res) => {
    getUnofficalKeys(req,res)
})

router.post("/unofficalkeysetting", async(req, res) => {
        await postUnofficalKeys(req,res)
})

router.get("/unofficaltokenlist",(req,res)=>{
    getUnofficaltokenList(req,res)
})

router.get("/bingtokenlist",(req,res)=>{
    getBingTokenList(req,res)
})

router.get("/bardtokenlist",(req,res)=>{
    getBardUnofficalList(req,res)
})

router.get("/claudetokenlist",(req,res)=>{
    getClaudeTokenList(req,res)
})


module.exports = router;