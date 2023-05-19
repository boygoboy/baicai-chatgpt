

const bardUnofficalChat=async (req,res)=>{
      let {message}=req.body
      const {Bard} = await import("googlebard")

let cookies = `__Secure-1PSID=${process.env.BARD_AUTH}`;

let bot = new Bard(cookies, {
	inMemory: false, // optional: if true, it will not save conversations to disk
	savePath: "./chatjson/conversations.json", // optional: path to save conversations
});

let conversationId = "conversation name"; // optional: to make it remember the conversation


// let response = await bot.ask(message); // conversationId is optional
// console.log(response);
// res.json({
//     data:response
// })

// Simulating response streaming
await bot.askStream(
	(res) => {
		console.log(res);
	},
	message,
	// conversationId,
);
}

module.exports={
    bardUnofficalChat
}