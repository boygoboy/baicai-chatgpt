const {huggingchat}=require('../utils/message.js')

const huggingChat=async(req,res)=>{
   let options={
     cookie:'hf-chat=94690c2f-080a-46e5-bef3-229c3417b6d4; __stripe_mid=6cd5378e-b914-4b26-b8fd-d7dc42b4205fe242d0; token=kFBmIqHBptoStZlEGRnjmtnvxdrGCygIqQRIFOTwPhSoSfFhFSOLfgIhqKQHKwvSzYkdVdAUOmxTDliaedQWRwsSKlaNisPvOjEpxHvdDGPhaXoBLadrYyuTBzkTliXG',
     conversationId:'646db0ec21737e0ef1781b05',
     message:'你好'
   }
    try{
        let result=await huggingchat(options,(data)=>{
            console.log(data)
             
        })
        console.log(result)
        return res.json({
            errorCode: '0000',
            message: `对话成功!`,
            data: result
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
    }
}

module.exports={
    huggingChat
}