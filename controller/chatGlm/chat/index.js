const {sendMessage}=require('../utils/message')


const chatGlmMessage=async (req,res)=>{
    let options={
        token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4NTMyMTUzNywianRpIjoiNjNiODAzY2UtMDdhZS00MzMzLWE3MDctNzFkOGI2YmU2ZmNmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZmYjI5MWZjMmJiNzQ2YmNhMjY2MWJhN2EzNWM3Yjg2IiwibmJmIjoxNjg1MzIxNTM3LCJleHAiOjE2ODU0MDc5MzcsInJvbGVzIjpbInVuYXV0aGVkX3VzZXIiXX0.EMO3kkR4bpG10_-tQ9reEjuE4QN8E6mPOYNd26lSbTk',
        cookie:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4NTMyMTUzNywianRpIjoiZjM4ZTcwZTYtMjk3Ny00YTE3LTg1ZTMtMWZmNzVmODg2OTAzIiwidHlwZSI6InJlZnJlc2giLCJzdWIiOiJmZmIyOTFmYzJiYjc0NmJjYTI2NjFiYTdhMzVjN2I4NiIsIm5iZiI6MTY4NTMyMTUzNywiZXhwIjoxNzAwODczNTM3LCJyb2xlcyI6WyJ1bmF1dGhlZF91c2VyIl19.qmIO4VYJ_qvd6r3qa3KZSJZRrxFK2k631hvEtg_UU80',
        taskId:'647422bb58af2bb8503d801b',
        message:'中午好',
    }
    sendMessage(options,(message)=>{
        
    })
    res.json({
        code:200
    })
}

module.exports={
    chatGlmMessage
}