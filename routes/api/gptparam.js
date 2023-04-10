const express = require('express');
const router = express.Router();
const { getChatParam, putChatParam, getModelParam, putModelParam } = require('../../controller/gptParams/gptParams')

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


module.exports = router;