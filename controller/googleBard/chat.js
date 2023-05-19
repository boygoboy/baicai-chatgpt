
const bardUnofficalChat=async (options,handleMessage)=>{
      let {url,token,proxyObj,enablecontext,model,message,connectId,userId}=options
	  let cookies = `__Secure-1PSID=${token||process.env.BARD_AUTH}`;
		const {Bard} = await import("googlebard")
		let bot = new Bard(cookies, {
			inMemory: false, // optional: if true, it will not save conversations to disk
			savePath: `./chatjson/conversations${userId}.json`, // optional: path to save conversations
			// proxy: {
			// 	// optional: proxy configuration
			// 	host: process.env.PROXY_HOST,
			// 	port: process.env.PROXY_PORT,
			// 	auth: {
			// 		username: process.env.PROXY_USERNAME,
			// 		password: process.env.PROXY_PASSWORD,
			// 	},
			// 	protocol: "http",
			// },
		});
let conversationId = connectId; // optional: to make it remember the conversation

// let response = await bot.ask(message,conversationId); // conversationId is optional
// console.log(response);
// handleMessage(response)

handleMessage(`[DONE]`)

// Simulating response streaming
await bot.askStream(
	(res) => {
		handleMessage(res);
	},
	message,
	conversationId,
);
handleMessage(`[DONE]`)
}

module.exports={
    bardUnofficalChat
}