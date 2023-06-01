const {
    decrypt
} = require('../../../utils/encryption.js')
const {
    PoeClient,
    BotNickNameEnum
} = require('../utils/poeClient.js')
let modelObj = {
    'Claude-instant': 'a2',
    'Claude+': 'a2_2',
    'GPT-4': 'beaver',
    'Sage': 'capybara',
    'Dragonfly': 'nutria',
    'ChatGPT': 'chinchilla',
    'NeevaAI': 'hutia'
}

const poeChatMessage = async (opt, handleMessage) => {
    try{
        let {
            cookie,
            model,
            message,
            envConfig
        } = opt
        cookie = decrypt(cookie)
        model = modelObj[model]
        console.log(`envConfig:`, envConfig)
        const client = new PoeClient({
            cookie: cookie,
            env: envConfig, // pass {"poe-formkey": "xxx", "buildId": "xxx" ......} after fetch them first from client1.init()
            logLevel: 'debug'
        });
        const env = await client.init(false)
        console.log(`env:`, JSON.stringify(env, null, 2))
    
        let isstart = false
        let result = await client.sendMessage(message, BotNickNameEnum[model], false, (data) => {
            if (!isstart) {
                handleMessage('[START]')
                isstart = true
            }
            handleMessage(data)
            console.log(`${data}`)
        })
        console.log(result)
        handleMessage(`[DONE]${JSON.stringify(env, null, 2)}`)
    }catch(error){
      handleMessage(`[ERROR]`)
    }
}

module.exports = {
    poeChatMessage
}