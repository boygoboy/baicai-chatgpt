const axios = require('axios')
const {getOffset}=require('./track.js')
// 请求https://www.geetest.com/demo/gt/register-slide接口获取get challenge
const get_gt_challenge = async (req,res) => {
    try{
        let config = {
            method: "GET",
            headers:{
                'Accept':'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding':'gzip, deflate, br',
                'Accept-Language':'zh-CN,zh;q=0.9',
                'Cache-Control':'no-cache',
                'Cookie':'sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221889058b8795f5-0ee6b74f0329158-6f7c2b1b-2073600-1889058b87a455%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Fwww.geetest.com%2F%22%7D%2C%22%24device_id%22%3A%221889058b8795f5-0ee6b74f0329158-6f7c2b1b-2073600-1889058b87a455%22%7D; PPA_CI=475d2146005a0d0e108c8dd61ebae0ef',
                'Dnt':1,
                'Pragma':'no-cache',
                'Referer':'https://www.geetest.com/demo/slide-float.html',
               ' Sec-Ch-Ua':'"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
                'Sec-Ch-Ua-Mobile':'?0',
                'Sec-Ch-Ua-Platform':"Windows",
                'Sec-Fetch-Dest':'empty',
                'Sec-Fetch-Mode':'cors',
                'Sec-Fetch-Site':'same-origin',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'X-Requested-With':'XMLHttpRequest'
            },
            baseURL: `https://www.geetest.com/demo/gt/register-slide?t=${Date.now()}`,
        }
        let result = await axios(config)
        if(result.status==200){
            return res.json({
                errorcode:200,
                message:'获取gt_challenge成功',
                data:result.data
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
                'Cookie':'sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221889058b8795f5-0ee6b74f0329158-6f7c2b1b-2073600-1889058b87a455%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Fwww.geetest.com%2F%22%7D%2C%22%24device_id%22%3A%221889058b8795f5-0ee6b74f0329158-6f7c2b1b-2073600-1889058b87a455%22%7D; PPA_CI=475d2146005a0d0e108c8dd61ebae0ef',
                'Dnt':1,
                'Pragma':'no-cache',
                'Referer':'https://www.geetest.com/demo/slide-float.html',
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
                'Cookie':'sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221889058b8795f5-0ee6b74f0329158-6f7c2b1b-2073600-1889058b87a455%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Fwww.geetest.com%2F%22%7D%2C%22%24device_id%22%3A%221889058b8795f5-0ee6b74f0329158-6f7c2b1b-2073600-1889058b87a455%22%7D; PPA_CI=475d2146005a0d0e108c8dd61ebae0ef',
                'Dnt':1,
                'Pragma':'no-cache',
                'Referer':'https://www.geetest.com/',
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
                'Cookie':'GeeTestUser=059f6295e03ddd650d1bfca368c4cdd9; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221889058b8795f5-0ee6b74f0329158-6f7c2b1b-2073600-1889058b87a455%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Fwww.geetest.com%2F%22%7D%2C%22%24device_id%22%3A%221889058b8795f5-0ee6b74f0329158-6f7c2b1b-2073600-1889058b87a455%22%7D; GeeTestAjaxUser=a1d46b1101a027de070deacb7900149a',
                'Dnt':1,
                'Host':'api.geetest.com',
                'Pragma':'no-cache',
                'Referer':'https://www.geetest.com/',
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
                'Cookie':'GeeTestAjaxUser=ccc241e8ed96eb795ed528364e9648c3; GeeTestUser=63efe0d48128ebc4a0eb45e3b7a077f5; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221888f3e109be0a-01203cae759203d-26031a51-2073600-1888f3e109dc5%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Fwww.geetest.com%2F%22%7D%2C%22%24device_id%22%3A%221888f3e109be0a-01203cae759203d-26031a51-2073600-1888f3e109dc5%22%7D',
                'Host': 'api.geetest.com',
                'Referer':'https://www.geetest.com/',
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
                'Cookie':'GeeTestAjaxUser=ccc241e8ed96eb795ed528364e9648c3; GeeTestUser=63efe0d48128ebc4a0eb45e3b7a077f5; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221888f3e109be0a-01203cae759203d-26031a51-2073600-1888f3e109dc5%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Fwww.geetest.com%2F%22%7D%2C%22%24device_id%22%3A%221888f3e109be0a-01203cae759203d-26031a51-2073600-1888f3e109dc5%22%7D',
                'Host': 'api.geetest.com',
                'Referer':'https://www.geetest.com/',
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
                client_type: web,
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