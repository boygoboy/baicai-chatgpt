function handlePrompt(message){
let prompt=''
message.forEach(item=>{
    if(item.role=='system'){
        return
    }
    prompt+=`${item.role=='assistant'?'AI回答':'you'}:${item.content}\n`
})
prompt+="使用markdown格式回答我"
return prompt
}

module.exports = { handlePrompt }