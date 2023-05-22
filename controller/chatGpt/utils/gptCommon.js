const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const BingAIClient =require('../../newBing/utils/message.js')
    const computedMoney=async (apikey,lastday)=>{
        const subscription_url = `${process.env.OPEN_AI_BASE_URL||'https://api.openai.com'}/v1/dashboard/billing/subscription`;
        const headers = {
            "Authorization": `Bearer ${apikey}`,
            "Content-Type": "application/json"
        };
        let resultdata={
            total:null,
            total_usage:null,
            remain_money:null,
            history_usage:[]
        }
        try{
            let subscription_response=await  axios.get(subscription_url, { headers: headers })
                      if (subscription_response.status === 200) {
                          const data = subscription_response.data;
                          const total = data.hard_limit_usd;
              
                          const startDate = new Date(Date.now() - 99 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                          const endDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                          const billing_url = `${process.env.OPEN_AI_BASE_URL||'https://api.openai.com'}/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`;
              
                      let billing_response =await axios.get(billing_url, { headers: headers })
                                  if (billing_response.status === 200) {
                                      const data = billing_response.data;
                                      const total_usage = data.total_usage / 100;
                                      const daily_costs = data.daily_costs;
                                      const days = Math.min(lastday, daily_costs.length);
                                      let recent = `##### 最近${days}天使用情况\n`;
              
                                      for (let i = 0; i < days; i++) {
                                          const cur = daily_costs[daily_costs.length - i - 1];
                                          const date = new Date(cur.timestamp * 1000).toISOString().split('T')[0];
                                          const line_items = cur.line_items;
                                          let cost = 0;
                                          for (const item of line_items) {
                                              cost += item.cost;
                                          }
                                          recent += `\t${date}\t${cost / 100}\n`;
                                          resultdata.history_usage.push({
                                              date,
                                              cost:cost/100
                                          })
                                      }
              
                                      const result = `#### 总额:\t${total.toFixed(4)}\n` +
                                          `#### 已用:\t${total_usage.toFixed(4)}\n` +
                                          `#### 剩余:\t${(total - total_usage).toFixed(4)}\n\n${recent}`;
                                      console.log(result);
                                      resultdata.total=total.toFixed(4)
                                      resultdata.total_usage=total_usage.toFixed(4)
                                      resultdata.remain_money=(total - total_usage).toFixed(4)
                                      return resultdata
                                  } else {
                                      return false
                                  }
      
                      } else {
                          return false
                      }
        }catch(error){
          return false
        }
    }

    // 非官方聊天接口测活
    const unfficalChatApiLive=async(accesstoken)=>{
        let  conversationId
        let  parentMessageId
        let  messageId 
        let  action = 'next'
        let  prompt="hello"
          try{
            conversationId=conversationId?conversationId:null
            parentMessageId=parentMessageId?parentMessageId:uuidv4()
              messageId=messageId?messageId:uuidv4()
            let config = {
              method: "POST",
              baseURL: `${process.env.UNOFFICAL_OPEN_AI_BASE_URL}/backend-api/conversation`,
              headers: {
                  accept: 'text/event-stream',
                  'x-openai-assistant-app-id': '',
                  authorization: `Bearer ${accesstoken}`,
                  'content-type': 'application/json',
                  referer: 'https://chat.openai.com/chat',
                  library: 'chatgpt-plugin'
              },
              referrer: 'https://chat.openai.com/chat',
              data: {
                  action,
                  messages: [
                    {
                      id: messageId,
                      role: 'user',
                      content: {
                        content_type: 'text',
                        parts: [prompt]
                      }
                    }
                  ],
                  model: 'text-davinci-002-render-sha',
                  parent_message_id: parentMessageId,
                  conversation_id: conversationId?conversationId:null,
                },
              responseType: "stream"
          }
          let response = await axios(config)
          if(response.status==200){
              return true
          }else{
              false
          }
          }catch(error){
            return false
          }
    }
    
    // chatgpt session测活
    const sessionIsLive=async(session)=>{
        try{
            let config = {
                method: "GET",
                baseURL: `${process.env.OPEN_AI_BASE_URL||'https://api.openai.com'}/dashboard/user/api_keys`,
                headers: {
                    accept: '*/*',
                    authorization: `Bearer ${session}`,
                    'content-type': 'application/json',
                    origin:'https://platform.openai.com',
                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
                },
                referrer: 'https://platform.openai.com/',
            }
            let response = await axios(config)
            if(response.status==200){
                return true
            }else{
                false
            }
        }catch(error){
            return false
        }
    }

    // new bing测活
    const newBingIsLive=async(token,cookie)=>{
        const options = {
            // Necessary for some people in different countries, e.g. China (https://cn.bing.com)
            host: 'https://www.bing.com',
            // "_U" cookie from bing.com
            userToken: token,
            // If the above doesn't work, provide all your cookies as a string instead
            // cookies: process.env.BING_AI_SESSION,
            cookies: cookie,
            // (Optional) Set to true to enable `console.debug()` logging
            debug: false,
        };
        let bingAIClient = new BingAIClient(options);
        let chatoptions={
            // (Optional) Set a conversation style for this message (default: 'balanced')
            toneStyle: 'balanced', // or creative, precise, fast
            jailbreakConversationId: true,
            onProgress: (token) => {
                process.stdout.write(token);
            },
        }
        try{
            let response = await bingAIClient.sendMessage('hello', chatoptions);
            console.log(JSON.stringify(response, null, 2)); 
            return true
        }catch(error){
            return false
        }
    }

    // bard测活
    const bardIsLive=async(token)=>{
        try{
            const {Bard} = await import("googlebard")
            let cookies = `__Secure-1PSID=${token}`;
            let bot = new Bard(cookies);
            let response = await bot.ask('hello');
            console.log(response); 
            if(response){
                return true
            }else{
                return false
            }
        }catch(error){
             return false
        }
    }

    // claudece测活
    const claudeceIsLive=async(token,appid)=>{
        try{
            const module = await import('claude-api');
            const Authenticator = module.default;
            // user-token
            token = token,
            // claude appid
            bot = appid,
            text = 'hello'
    
          const authenticator = new Authenticator(token, bot)
          // 创建一个频道，已存在则直接返回频道ID
          const channel = await authenticator.newChannel('chat-7890')
          let result = await authenticator.sendMessage({
            text, channel, onMessage: (data) => {
            }
          })
          console.log('==============1\n', result)
          if(result.result.conversationId){
            return true
          }else{
            return false
          }
        }catch(error){
            return false
        }
    }

    module.exports={
        computedMoney,unfficalChatApiLive,sessionIsLive,newBingIsLive,bardIsLive,claudeceIsLive
    }