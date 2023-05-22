const {decrypt}=require('../../utils/encryption.js')
const bardUnofficalChat=async (options,handleMessage)=>{
      let {url,token,proxyObj,enablecontext,model,message,connectId,userId}=options
	  if(token){
        token=decrypt(token)
    }
	  let cookies = `__Secure-1PSID=${token||process.env.BARD_AUTH}`;
		const {Bard} = await import("googlebard")
		let optionsobj=null
		if(enablecontext){
			optionsobj={
				inMemory: false, // optional: if true, it will not save conversations to disk
				savePath: `./chatjson/conversations${userId}.json`, // optional: path to save conversations
			}
		}else{
			optionsobj={
				inMemory: true
			}
		}
		if(proxyObj.proxytype){
			optionsobj.proxy={
				// optional: proxy configuration
				host: proxyObj.ip?proxyObj.ip:'',
				port: proxyObj.port?proxyObj.port:'',
				protocol: proxyObj.proxytype,
			}
			if(proxyObj.username&&proxyObj.password){
				optionsobj.proxy.auth={
					username: proxyObj.username?proxyObj.username:"",
					password: proxyObj.password?proxyObj.password:"",
				}
			}
		}
		let bot = new Bard(cookies, optionsobj);
let conversationId = connectId; // optional: to make it remember the conversation

let isstart=false
let res= await bot.askStream(
	(res) => {
		if(!isstart){
			handleMessage('[START]')
			isstart=true
		}
		handleMessage(res);
	},
	message,
	conversationId,
);
console.log(res)
handleMessage(`[DONE]`)
}

module.exports={
    bardUnofficalChat
}