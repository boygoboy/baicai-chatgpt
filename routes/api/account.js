var express = require('express');
var router = express.Router();
const axios = require('axios')
const {addAccountList, editAccountList, getAccountList, deleteAccountList,addApiKey,deleteApiKey,getApiKey } = require("../../controller/chatGpt/account")
router.get("/accountlist", (req,res) => {
        // getApiKey(req,res)

    getAccountList(req,res)
})
router.post("/accountlist",  (req,res) => {
    addAccountList(req,res)
})
router.put("/accountlist",  (req,res) => {
    editAccountList(req,res)
})

router.delete("/accountlist/:ids",  (req,res) => {
    deleteAccountList(req,res)
})

// 增加apikey
router.post("/apikey",(req,res)=>{
    addApiKey(req,res)
})

// 删除apikey
router.post("/apikey",(req,res)=>{
   deleteApiKey(req,res)
})
//查询apikey
router.get("/apikey",(req,res)=>{


})

module.exports = router