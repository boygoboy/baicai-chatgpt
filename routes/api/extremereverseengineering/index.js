const express = require('express');
const router = express.Router();
const {get_gt_challenge,gettype,get_php,sendajax1} =require('./controller/index.js') 
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

module.exports = router;