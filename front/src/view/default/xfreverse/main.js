import {loadCryptoJS,get_i_arrstring,getCanvasFingerprint,info} from './environment/getwindowInfo.js'
import  './fullpage.js'
import axios from 'axios'

let str16=''
let windowsinfo_i=null
//生成16位随机字符串
const random_t=()=> { return (65536 * (1+Math.random()) | 0).toString(16).substring(1)}
//生成O_b
const getO_b=()=>{
	return random_t()+random_t()+random_t()+random_t()
}

//获取gt challenge
const get_gt_challenge=async ()=>{
    try{
        const res=await axios.get('/api/api/jiyan/getgtchallenge')
        if(res.status==200){
            return res.data.data
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

// 获取gettype接口相关信息
const gettype=async (gt)=>{
    try{
        const res=await axios.get(`/api/api/jiyan/gettype?gt=${gt}`)
        if(res.status==200){
            return res.data.data
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

//生成get.php接口加密参数w
const get_php_w=async (gt,challenge,result_gettype)=>{
    let {aspect_radio,beeline,type,static_servers,voice,click,fullpage,geetest,slide}=result_gettype
    try{
        await loadCryptoJS();
        info.canvas2DFP = await getCanvasFingerprint();
        let a={
            "gt":gt,
            "challenge":challenge,
            "offline":false,
            "new_captcha":true,
            "product":"float",
            "width":"300px",
            "https":true,
            "api_server":"apiv6.geetest.com",
            "protocol":"https://",
            "type":type,
            "static_servers":static_servers,
            "beeline":beeline,
            "voice":voice,
            "click":click,
            "fullpage":fullpage,
            "slide":slide,
            "geetest":geetest,
            "aspect_radio":aspect_radio,
            "cc":8,
            "ww":true,
            "i":get_i_arrstring(info)
        }
        console.log(a.i)
        windowsinfo_i=a.i
        let b=getO_b()
        console.log('generate',b)
        str16=b
        let o=window.getO['encrypt1'](JSON.stringify(a),b)
        console.log(o)
        let i= window.getI["\u0024\u005f\u0048\u0045\u0066"](o)
         console.log(i)   
         	//获取r值 调用方式window.gebt_r["getr"]
         const r= window.get_r['getr'](b)
        return i+r
    }catch(error){
        return false
    }
}
// 发送get.php请求，获取必要信息
const getphp_info=async (gt,challenge,w)=>{
    try{
        let config = {
            method: "GET",
            baseURL: `/api/api/jiyan/getphp`,
            params:{
                gt,
                challenge,
                w
            }
        }
        const res=await axios(config)
        if(res.status==200){
            return res.data.data
        }else{
            return false
        }
    }catch(error){
        return false
    }
}
// 生成第一次ajax.php接口请求w参数值
const get_ajax_php_w1=async (gt,challenge,result_gettype,result_getphp_info)=>{
    const _e='M-/8Pjp2.*M,fAB))))8)b(--(9((b.(:(A6_Adf9acPp1/nEmcR1-1M9K0-1-0NjK0//I9NjILmiNjK1-0Nj-)9Uk@-fM*Gn((n0(858q55f-5-)M9(d-f5I-*b95Q/5-*590*(Y-)4)(94)(I-*bE0)MY-)4)M9/)()Mj)qqq(.,kM/(U0NkS((KLGb1)(M391/f7Y*,cK*)7NX)(A*(Q-*(b1(5*(,)9(ScO:j1.N92E9,(M(((8n'
    const _n=windowsinfo_i.split('!!').join("magic data")
    const _n1=windowsinfo_i
    const aeskey=str16
    let {api_server,c,feedback,i18n_labels,s,static_servers,theme,theme_version,logo}=result_getphp_info
    let {aspect_radio,beeline,type,voice,click,fullpage,geetest,slide}=result_gettype
    const _o={
        "$_CAAU": Date.now(),
        "protocol": "https://",
        "gt": gt, //从前面接口获取
        "challenge": challenge,  //从前面接口获取 
        "offline": false,
        "new_captcha": true,
        "product": "float",
        "width": "300px",
        "https": true,
        "api_server": api_server,
        "type": type,
        "static_servers": static_servers,
        "beeline": beeline,
        "voice": voice,
        "click": click,
        "fullpage": fullpage,
        "slide": slide,
        "geetest": geetest,
        "aspect_radio": aspect_radio,
        "cc": 8,
        "supportWorker": true,
        "$_FF_": {
            "pt": 0
        },
        "aeskey": aeskey, //注意这里的随机16为字符串需要和前面的get.php加密字符串一样
        "theme": theme,
        "theme_version": theme_version,
        "logo": logo,
        "feedback": feedback,
        "c": c,  //这个从get.php接口获取
        "s": s, //这个从get.php接口获取
        "i18n_labels": i18n_labels
    }
    console.log(_e)
    console.log(_n)
    console.log(_o)
    console.log(_n1)
    console.log(aeskey)
    return window.getajax1_w["w"](_e,_n,_o,_n1,aeskey)
}
// 发送第一次ajax.php接口请求
const sendajax1=async(gt,challenge,w)=>{
    try{
        let config = {
            method: "GET",
            baseURL: '/api/api/jiyan/ajax1php',
            params:{
                gt,
                challenge,
                w
            }
        }
        const res=await axios(config)
        if(res.status==200){
            return res.data.data
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

 export async function startpass(){
    //获取gt 和challenge
      const result_gt_challenge=await get_gt_challenge()
      console.log(result_gt_challenge)
      let {gt,challenge}= result_gt_challenge
      let result_gettype=await gettype(gt)
        console.log(result_gettype)
        if(!gt||!challenge||!result_gettype){
            console.log('获取gt challenge失败')
            return false
        }
     //生成get.php接口加密参数w
     let w=await get_php_w(gt,challenge,result_gettype)
     console.log(w)
    //  发送get.php请求
    let result_getphp_info=await getphp_info(gt,challenge,w)
    console.log(result_getphp_info)
    //生成第一次ajax.php接口请求w参数值
    // w=await get_ajax_php_w1(gt,challenge,result_gettype,result_getphp_info)
    w=await get_ajax_php_w1(gt,challenge,result_gettype,result_getphp_info)
    console.log(w)
    //发送第一次ajax.php接口请求
    let result_ajax1=await sendajax1(gt,challenge,w)
    console.log(result_ajax1)
 }

