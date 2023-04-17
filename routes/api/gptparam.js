const express = require('express');
const router = express.Router();
const { getChatParam, putChatParam, getModelParam, putModelParam ,getUserChatParam} = require('../../controller/gptParams/gptParams')

router.put("/chatparam", (req, res) => {
    putChatParam(req,res)
})
router.get("/chatparam", (req, res) => {
    getChatParam(req,res)
})

router.put("/modelparam", (req, res) => {
    putModelParam(req,res)
})

router.get("/modelparam", (req, res) => {
    getModelParam(req,res)
})

router.get("/userchatparam",(req,res)=>{
    getUserChatParam(req,res)
})


module.exports = router;