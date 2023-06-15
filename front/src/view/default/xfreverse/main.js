import {loadCryptoJS,get_i_arrstring,getCanvasFingerprint,info} from './environment/getwindowInfo.js'
import  './fullpage.js'
import './slide.js'
import axios from 'axios'
import $http from '../../../http/http.js'
let str16=''
let windowsinfo_i=null
//生成16位随机字符串
const random_t=()=> { return (65536 * (1+Math.random()) | 0).toString(16).substring(1)}
//生成O_b
const getO_b=()=>{
	return random_t()+random_t()+random_t()+random_t()
}

const getxfyunGTChallenge=()=>{
    return $http({
        url:`/api/jiyan/getgtchallenge`,
        method:'get',
    })
}

//获取gt challenge
const get_gt_challenge=async ()=>{
    try{
        const res=await getxfyunGTChallenge()
        if(res.errorcode==200){
            return res.data
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

// 发送第二次getphp接口
const getlastphp=async(gt,challenge)=>{
    try{
        let config = {
            method: "GET",
            baseURL: '/api/api/jiyan/getlastphp',
            params:{
                gt,
                challenge
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
// 获取滑块轨迹
const gettrackdata=async(bg,fullbg)=>{
    try{
        let config = {
            method: "GET",
            baseURL: '/api/api/jiyan/slidetrack',
            params:{
                bg,
                fullbg
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
// 加密滑块校验的w值
const generate_w=(result_getlastphp,trackData)=>{
    const h= generte_w_h(result_getlastphp,trackData)
    const u= generate_w_u()
    return h+u
}
// 生成u值
const generate_w_u=()=>{
    return new window.getu()["encrypt"](str16)
}
// 生成h值
const generte_w_h=(result_getlastphp,trackData)=>{
    // I参数的加密变量o对象破解：
    //userresponse 属性破解：
    let {offset,trackdata}=trackData
    let {gt,challenge,c,s}=result_getlastphp
  let userresponse= window.export_userresponse(offset,challenge)
    let passtime=trackdata.at(-1)[2] //滑动时间
    // rp属性加密破解
    let rp= window.geto_rp(gt+challenge.slice(0,32)+ passtime)
//  aa 属性破解：
//aa 中t的破解
  //加密o中aa变量方法 ,调用window.getO_aa["\u0024\u005f\u0042\u0042\u0045\u0049"](t,e,n)
//t为加密参数带破解 e为接口返回的c n为接口返回的s
// 本质为轨迹的加密 调用方法 window.getO_aa[aa_t](track) track为轨迹数据， track 可以用函数模拟出
  let aa_t=window.getO_aa['aa_t'](trackdata)
  let aa=window.getO_aa["\u0024\u005f\u0042\u0042\u0045\u0049"](aa_t,c,s)
//   组装o对象
let o={
    "lang": "zh-cn",
    "userresponse": userresponse,
    "passtime": passtime,
    "imgload": 257,
    "aa": aa,
    "ep": {
        "v": "7.9.0",
        "$_BIo": false,
        "me": true,
        "tm": {
            "a": 1686750375355,
            "b": 1686750375897,
            "c": 1686750375897,
            "d": 0,
            "e": 0,
            "f": 1686750375371,
            "g": 1686750375371,
            "h": 1686750375371,
            "i": 1686750375388,
            "j": 1686750375429,
            "k": 1686750375389,
            "l": 1686750375429,
            "m": 1686750375470,
            "n": 1686750375506,
            "o": 1686750375899,
            "p": 1686750376316,
            "q": 1686750376316,
            "r": 1686750376319,
            "s": 1686750376903,
            "t": 1686750376904,
            "u": 1686750376904
        },
        "td": -1
    },
    "h9s9": "1816378497",
    "rp": rp
}
//   I属性加密破解
 let I=window.export_l(JSON.stringify(o),str16)
//  加密u
  let u=  window.geth["\u0024\u005f\u0046\u0045\u0045"](I) //I为数组也是加密得到
  return u
}

// 发送滑块校验接口
const passCheck=async(gt,challenge,w)=>{
    try{
        let config = {
            method: "GET",
            baseURL: '/api/api/jiyan/checkslide',
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
    // 发送第二次getphp接口
    let result_getlastphp=await getlastphp(gt,challenge)
    console.log(result_getlastphp)
    let {bg,fullbg}=result_getlastphp
    challenge=result_getlastphp.challenge
    let trackData=await gettrackdata(bg,fullbg)
    let {offset,trackdata}=trackData
    console.log(offset)
    console.log(trackdata)
    // 加密滑块校验的w值
    w= generate_w(result_getlastphp,trackData)
    console.log(w)
    // 发送第二次ajax.php接口请求
    let checkresult=await passCheck(gt,challenge,w)
    console.log(checkresult)
    checkresult.challenge=challenge
    return checkresult
 }

