const express = require('express');
const router = express.Router();
const {getKeyList,postKeyList,putKeyList,deleteKeyList,getKeyDetail,changeKeyStatus}=require('../../../controller/chatGpt/keylist.js')
const {getTokenList,postTokenList,putTokenList,deleteTokenList,getTokenDetail,changeEnableStatus,loginToken,loginSession}=require('../../../controller/chatGpt/tokenlist.js')
const {getBingList,postBingList,putBingList,deleteBingList,getBingDetail,changeBingStatus}=require('../../../controller/chatGpt/binglist.js')
const {getBardList,postBardList,putBardList,getBardDetail,deleteBardList,changeBardStatus}=require('../../../controller/chatGpt/bardlist.js')
const {getClaudeList,postClaudeList,putClaudeList,getClaudeDetail,deleteClaudeList,changeClaudeStatus}=require('../../../controller/chatGpt/claudelist.js')
const {getHuggingList,postHuggingList,putHuggingList,getHuggingDetail,deleteHuggingList,changeHuggingStatus}=require('../../../controller/chatGpt/hugginglist.js')
const {getXfyunList,postXfyunList,putXfyunList,getXfyunDetail,deleteXfyunList,changeXfyunStatus}=require('../../../controller/chatGpt/xfyunlist.js')
const { getPoeList,postPoeList,putPoeList,getPoeDetail,deletePoeList,changePoeStatus}=require('../../../controller/chatGpt/poelist.js')
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

//

router.get("/binglist", (req, res) => {
    getBingList(req,res)
})

router.get("/onebing/:id", (req, res) => {
    getBingDetail(req,res)
})

router.post("/binglist", (req, res) => {
    postBingList(req,res)
})

router.put("/binglist", (req, res) => {
    putBingList(req,res)
})

router.delete("/binglist/:ids", (req, res) => {
    deleteBingList(req,res)

})

router.put("/binglist/bingstatus",(req,res)=>{
    changeBingStatus(req,res)
})

// bard接口模块

router.get("/bardlist",(req,res)=>{
    getBardList(req,res)
})

router.get("/onebard/:id",(req,res)=>{
    getBardDetail(req,res)
})

router.post("/bardlist",(req,res)=>{
    postBardList(req,res)
})

router.put("/bardlist",(req,res)=>{
    putBardList(req,res)
})

router.delete("/bardlist/:ids",(req,res)=>{
    deleteBardList(req,res)
})

router.put("/bardlist/bardstatus",(req,res)=>{
    changeBardStatus(req,res)
})

// claude接口模块
router.get("/claudelist",(req,res)=>{
    getClaudeList(req,res)
})

router.get("/oneclaude/:id",(req,res)=>{
    getClaudeDetail(req,res)
})

router.post("/claudelist",(req,res)=>{
    postClaudeList(req,res)
})

router.put("/claudelist",(req,res)=>{
    putClaudeList(req,res)
})

router.delete("/claudelist/:ids",(req,res)=>{
    deleteClaudeList(req,res)
})

router.put("/claudelist/claudestatus",(req,res)=>{
    changeClaudeStatus(req,res)
})

// huggingchat接口模块
router.get("/hugginglist",(req,res)=>{
    getHuggingList(req,res)
})

router.get("/onehugging/:id",(req,res)=>{
    getHuggingDetail(req,res)
})

router.post("/hugginglist",(req,res)=>{
    postHuggingList(req,res)
})

router.put("/hugginglist",(req,res)=>{
    putHuggingList(req,res)
})

router.delete("/hugginglist/:ids",(req,res)=>{
    deleteHuggingList(req,res)
})

router.put("/hugginglist/huggingstatus",(req,res)=>{
    changeHuggingStatus(req,res)
})

// xfyun接口模块
router.get("/xfyunlist",(req,res)=>{
    getXfyunList(req,res)
})

router.get("/onexfyun/:id",(req,res)=>{
    getXfyunDetail(req,res)
})

router.post("/xfyunlist",(req,res)=>{
    postXfyunList(req,res)
})

router.put("/xfyunlist",(req,res)=>{
    putXfyunList(req,res)
})

router.delete("/xfyunlist/:ids",(req,res)=>{
    deleteXfyunList(req,res)
})

router.put("/xfyunlist/xfyunstatus",(req,res)=>{
    changeXfyunStatus(req,res)
})

// poe接口模块
router.get("/poelist",(req,res)=>{
    getPoeList(req,res)
})

router.get("/onepoe/:id",(req,res)=>{
    getPoeDetail(req,res)
})

router.post("/poelist",(req,res)=>{
    postPoeList(req,res)
})

router.put("/poelist",(req,res)=>{
    putPoeList(req,res)
})

router.delete("/poelist/:ids",(req,res)=>{
    deletePoeList(req,res)
})

router.put("/poelist/poestatus",(req,res)=>{
    changePoeStatus(req,res)
})


module.exports = router;