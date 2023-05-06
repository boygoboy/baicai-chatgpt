const express = require('express');
const router = express.Router();
const {getKeyList,postKeyList,putKeyList,deleteKeyList,getKeyDetail,changeKeyStatus}=require('../../../controller/chatGpt/keylist.js')
const {getTokenList,postTokenList,putTokenList,deleteTokenList,getTokenDetail,changeEnableStatus,loginToken,loginSession}=require('../../../controller/chatGpt/tokenlist.js')

router.get("/keylist", (req, res) => {
    getKeyList(req,res)
})

router.get("/onekey/:id", (req, res) => {
    getKeyDetail(req,res)
})

router.post("/keylist", (req, res) => {
    postKeyList(req,res)
})

router.put("/keylist", (req, res) => {
    putKeyList(req,res)
})

router.delete("/keylist/:ids", (req, res) => {
    deleteKeyList(req,res)

})

router.put("/keylist/keystatus",(req,res)=>{
    changeKeyStatus(req,res)
})

// 

router.get("/tokenlist", (req, res) => {
    getTokenList(req,res)
})

router.get("/onetoken/:id", (req, res) => {
    getTokenDetail(req,res)
})

router.post("/tokenlist", (req, res) => {
    postTokenList(req,res)
})

router.put("/tokenlist", (req, res) => {
    putTokenList(req,res)
})

router.delete("/tokenlist/:ids", (req, res) => {
    deleteTokenList(req,res)

})

router.put("/tokenlist/enablestatus",(req,res)=>{
    changeEnableStatus(req,res)
})

router.post("/login/token",(req,res)=>{
    console.log(req.body)
    loginToken(req,res)
})
router.post("/login/session",(req,res)=>{
    loginSession(req,res)
})


module.exports = router;