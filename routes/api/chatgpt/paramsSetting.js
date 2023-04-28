const express = require('express');
const router = express.Router();
const {postChatParams,putChatParams,getChatParams,deleteChatParams}=require('../../../controller/chatGpt/paramsSetting.js')

router.put("/chatparams", (req, res) => {
    putChatParams(req,res)
})
router.get("/chatparams", (req, res) => {
    getChatParams(req,res)
})

router.post("/chatparams", (req, res) => {
     postChatParams(req,res)
})

router.delete("/chatparams/:id", (req, res) => {
      deleteChatParams(req,res)
})

module.exports = router;