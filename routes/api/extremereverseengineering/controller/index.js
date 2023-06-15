const axios = require('axios')
const {getOffset}=require('./track.js')
const unofficalkeys = require('../../../../db/models/chatgpt/keyUnOfficalSchema')
// 请求https://www.geetest.com/demo/gt/register-slide接口获取get challenge
const get_gt_challenge = async (req,res) => {
    try{
        let {userId}=req.user.userList
        // 查询对应用户的key
        let Cookie=''
        const resultkey=await unofficalkeys.findOne({userId}).exec()
        if(resultkey&&resultkey.xfyuntoken){
            Cookie=resultkey.xfyuntoken
        }
        let config = {
            method: "GET",
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'zh-CN,zh;q=0.9',
                'Cache-Control':'no-cache',
                'Connection': 'keep-alive',
                'Cookie':Cookie,
                'Dnt':1,
                'Host':'xinghuo.xfyun.cn',
                'Pragma': 'no-cache',
                'Referer':'https://xinghuo.xfyun.cn/desk',
                'Sec-Ch-Ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform':"Windows",
                'Sec-Fetch-Dest':'empty',
                'Sec-Fetch-Mode':'cors',
                'Sec-Fetch-Site':'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'X-Requested-With':'XMLHttpRequest'
            },
            baseURL: `https://xinghuo.xfyun.cn/iflygpt/chat/gee-captcha`,
        }
        let result = await axios(config)
        if(result.status==200){
            return res.json({
                errorcode:200,
                message:'获取gt_challenge成功',
                data:result.data.data
            })
        }else{
            return res.json({
                errorcode:2002,
                message:'获取gt_challenge失败',
                data:null
            })
        }
    }catch(error){
        console.log(error)
       return res.json({
        errorcode:500,
        message:'系统错误',
        data:null
       })
    }
}

// 获取https://apiv6.geetest.com/gettype.php?gt=019924a82c70bb123aae90d483087f94接口返回的数据
const gettype=async (req,res)=>{
    try{
        let gt=req.query.gt
        let config = {
            method: "GET",
            baseURL: `https://apiv6.geetest.com/gettype.php?gt=${gt}`,
            headers:{
                'Accept':'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding':'gzip, deflate, br',
               ' Accept-Language':'zh-CN,zh;q=0.9',
               ' Cache-Control':'no-cache',
                'Dnt':1,
                'Pragma':'no-cache',
                'Referer':'https://xinghuo.xfyun.cn/',
                'Sec-Ch-Ua':'"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
               'Sec-Ch-Ua-Mobile':'?0',
                'Sec-Ch-Ua-Platform':"Windows",
                'Sec-Fetch-Dest':'empty',
                'Sec-Fetch-Mode':'cors',
               'Sec-Fetch-Site':'same-origin',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'X-Requested-With':'XMLHttpRequest',
            }
        }
        let result = await axios(config)
        result.data=result.data.slice(1, -1)
        result.data=JSON.parse(result.data)
        if(result.status==200){
            console.log(result.data)
            return res.json({
                errorcode:200,
                message:'获取gettype成功',
                data:result.data.data
            })
        }else{
            return res.json({
                errorcode:2002,
                message:'获取gettype失败',
                data:null
            })
        }
    }catch(error){
         return res.json({
          errorcode:500,
          message:'系统错误',
          data:null
         })
    }
}

const get_php=async (req,res)=>{
    try{
        let {gt,challenge,w}=req.query
        let config = {
            method: "GET",
            baseURL: `https://apiv6.geetest.com/get.php`,
            headers:{
                'Accept':'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'zh-CN,zh;q=0.9',
                'Cache-Control':'no-cache',
                'Dnt':1,
                'Pragma':'no-cache',
                'Referer':'https://xinghuo.xfyun.cn/',
                'Sec-Ch-Ua':'"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
                'Sec-Ch-Ua-Mobile':'?0',
                'Sec-Ch-Ua-Platform':"Windows",
                'Sec-Fetch-Dest':'empty',
                'Sec-Fetch-Mode':'cors',
                'Sec-Fetch-Site':'same-origin',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'X-Requested-With':'XMLHttpRequest',
                'Host':'apiv6.geetest.com'
            },
            params:{
                gt,
                challenge,
                lang:'zh-cn',
                pt:0,
                client_type:'web',
                w
            }
        }
        let result = await axios(config)
        if(result.status==200){
            console.log(result)
            result.data=result.data.slice(1, -1)
            result.data=JSON.parse(result.data)
            console.log(result.data)
            return res.json({
                errorcode:200,
                message:'获取getphp成功',
                data:result.data.data
            })
        }else{
            return res.json({
                errorcode:2002,
                message:'获取getphp失败',
                data:null
            })
        }
    }catch(error){
        console.log(error)
         return res.json({
          errorcode:500,
          message:'系统错误',
          data:null
         })
    }
}

const sendajax1=async (req,res)=>{
    try{
        let {gt,challenge,w}=req.query
        let config = {
            method: "GET",
            baseURL: `https://api.geetest.com/ajax.php`,
            headers:{
                'Accept':'*/*',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'zh-CN,zh;q=0.9',
                'Cache-Control':'no-cache',
               'Connection':'keep-alive',
                'Dnt':1,
                'Host':'api.geetest.com',
                'Pragma':'no-cache',
                'Referer':'https://xinghuo.xfyun.cn/',
                'Sec-Ch-Ua':'"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
                'Sec-Ch-Ua-Mobile':'?0',
                'Sec-Ch-Ua-Platform':"Windows",
                'Sec-Fetch-Dest':'script',
                'Sec-Fetch-Mode':'no-cors',
                'Sec-Fetch-Site':'same-site',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
            },
            params:{
                gt,
                challenge,
                lang:'zh-cn',
                pt:0,
                client_type:'web',
                w
            }
        }
        let result = await axios(config)
        if(result.status==200){
            console.log(result)
            result.data=result.data.slice(1, -1)
            result.data=JSON.parse(result.data)
            console.log(result.data)
            return res.json({
                errorcode:200,
                message:'第一次ajax.php请求成功',
                data:result.data.data
            })
        }else{
            return res.json({
                errorcode:2002,
                message:'第一次ajax.php请求失败',
                data:null
            })
        }
    }catch(error){
        console.log(error)
         return res.json({
          errorcode:500,
          message:'系统错误',
          data:null
         })
    }
}

const get_lastphp=async (req,res)=>{
    try{
        let {gt,challenge}=req.query
        const callback=`geetest_${Date.now()}`
        let config = {
            method: "GET",
            baseURL: `https://api.geetest.com/get.php`,
            headers:{
                'Accept':'*/*',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8',
                'Connection': 'keep-alive',
                'Host': 'api.geetest.com',
                'Referer':'https://xinghuo.xfyun.cn/',
                'Sec-Ch-Ua':'"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                'Sec-Ch-Ua-Mobile':'?0',
                'Sec-Ch-Ua-Platform':'"Windows"',
                'Sec-Fetch-Dest':'script',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site':'same-site',
                'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            },
            params:{
                gt,
                challenge,
                is_next: true,
                type: 'slide3',
                lang: 'zh-cn',
                https: true,
                protocol: 'https://',
                offline: false,
                product: 'embed',
                api_server: 'api.geetest.com',
                isPC: true,
                autoReset: true,
                width: '100%',
                callback:callback
            }
        }
        let result = await axios(config)
        if(result.status==200){
            console.log(result)
            result.data=result.data.replace(callback,'')
            result.data=result.data.slice(1, -1)
            result.data=JSON.parse(result.data)
            console.log(result.data)
            return res.json({
                errorcode:200,
                message:'获取getphp成功',
                data:result.data
            })
        }else{
            return res.json({
                errorcode:2002,
                message:'获取getphp失败',
                data:null
            })
        }
    }catch(error){
        console.log(error)
         return res.json({
          errorcode:500,
          message:'系统错误',
          data:null
         })
    }
}

const gettrackdata=async (req,res)=>{
    let {bg,fullbg}=req.query
    try{
       let trackdata=await getOffset(bg,fullbg)
       return res.json({
              errorcode:200,
              message:'获取轨迹成功',
                data:trackdata
       })
    }catch(error){
        console.log(error)
         return res.json({
          errorcode:500,
          message:'系统错误',
          data:null
         })
    }
}

// 发送最后一次滑块校验请求
const sendlastajax=async (req,res)=>{
    let {gt,challenge,w}=req.query
    try{
        const callback=`geetest_${Date.now()}`
        let config = {
            method: "GET",
            baseURL: `https://api.geetest.com/ajax.php`,
            headers:{
                'Accept':'*/*',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8',
                'Connection': 'keep-alive',
                'Host': 'api.geetest.com',
                'Referer':'https://xinghuo.xfyun.cn/',
                'Sec-Ch-Ua':'"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                'Sec-Ch-Ua-Mobile':'?0',
                'Sec-Ch-Ua-Platform':'"Windows"',
                'Sec-Fetch-Dest':'script',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site':'same-site',
                'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            },
            params:{
                gt,
                challenge,
                lang: 'zh-cn',
                $_BCX: 0,
                client_type: 'web',
                w,
                callback:callback
            }
        }
        let result = await axios(config)
        if(result.status==200){
            console.log(result)
            result.data=result.data.replace(callback,'')
            result.data=result.data.slice(1, -1)
            result.data=JSON.parse(result.data)
            console.log(result.data)
            return res.json({
                errorcode:200,
                message:'滑块验证成功',
                data:result.data
            })
        }else{
            return res.json({
                errorcode:2002,
                message:'滑块验证失败',
                data:null
            })
        }
    }catch(error){
        console.log(error)
        res.json({
            errorcode:500,
            message:'系统错误',
            data:null
        })
    }
}

module.exports = {
    get_gt_challenge,
    gettype,get_php,sendajax1,get_lastphp,gettrackdata,sendlastajax
}