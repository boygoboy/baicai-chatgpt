const express = require('express');
const router = express.Router();
const {get_gt_challenge,gettype,get_php,sendajax1,get_lastphp,gettrackdata,sendlastajax} =require('./controller/index.js') 
router.get('/getgtchallenge',(req,res)=>{
    get_gt_challenge(req,res)
})
router.get('/gettype',(req,res)=>{
    gettype(req,res)
})

router.get('/getphp',(req,res)=>{
    get_php(req,res)
})

router.get('/ajax1php',(req,res)=>{
    sendajax1(req,res)
})

router.get('/getlastphp',(req,res)=>{
    get_lastphp(req,res)
})

router.get('/slidetrack',(req,res)=>{
    gettrackdata(req,res)
})

router.get('/checkslide',(req,res)=>{
    sendlastajax(req,res)
})

module.exports = router;