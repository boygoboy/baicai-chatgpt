const Counter = require('../../db/models/counterSchema')
const chatparam = require('../../db/models/chatParmSchema')
const modelparam = require('../../db/models/modelParmSchema')

const getChatParam = async (req, res) => {
    let {
        userId
    } = req.user.userList
    try {
        const result = await chatparam.findOne({
            userId
        })
        if (!result) {
            //这一步运行一次就可以注释掉，自增需要有个初始值
            const countresult = await Counter.findOne({
                id: "chatparamId"
            })
            if (!countresult) {
                await Counter.create({
                    "id": "chatparamId",
                    "sequence_value": 0
                })
            }

            //处理自增chatparamId
            const count = await Counter.findOneAndUpdate({
                id: 'chatparamId'
            }, {
                $inc: {
                    sequence_value: 1
                }
            }, {
                new: true
            })
            const ChatParam = await new chatparam({
                chatparamId: count.sequence_value,
                channel: '官方',
                key: 'sk-xxxxxxxxxxxxx',
                model: 'gpt-3.5-turbo',
                userId,
                url:'',
                enablecontext:false,
                proxytype:'socks5',
                proxyurl:'127.0.0.1:80:admin:admin'
            })
            await ChatParam.save();
            const chatparamResult = await chatparam.findOne({
                userId
            })
            if (!chatparamResult) {
                return res.json({
                    errorCode: '2002',
                    message: '获取聊天配置参数失败2!',
                    data: null
                })
            } else {
                return res.json({
                    errorCode: '0000',
                    message: '获取聊天配置参数成功!',
                    data: chatparamResult
                })
            }
        } else {
            return res.json({
                errorCode: '0000',
                message: '获取聊天配置参数成功!',
                data: result
            })
        }
    } catch (error) {
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const putChatParam = async (req, res) => {
    let {
        channel,
        key,
        model,
        ...params
    } = req.body
    let {
        userId
    } = req.user.userList
    if (!channel || !key || !model) {
        return res.json({
            errorCode: '2002',
            message: '参数不能为空!',
            data: null
        })
    }

    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({
            id: "chatparamId"
        })
        if (!result) {
            await Counter.create({
                "id": "chatparamId",
                "sequence_value": 0
            })
        }
        const chatparamResult = await chatparam.findOne({
            userId
        })
        if (!chatparamResult) {
            //处理自增chatparamId
            const count = await Counter.findOneAndUpdate({
                id: 'chatparamId'
            }, {
                $inc: {
                    sequence_value: 1
                }
            }, {
                new: true
            })
            const ChatParam = await new chatparam({
                chatparamId: count.sequence_value,
                channel,
                key,
                model,
                userId,
                ...params
            })
            await ChatParam.save();
            return res.json({
                errorCode: '0000',
                message: '更新聊天配置成功!',
                data: null
            })
        } else {
            const chatparamList = await chatparam.findOneAndUpdate({
                userId
            }, {
                channel,
                key,
                model,
                ...params
            })
            if (!chatparamList) {
                return res.json({
                    errorCode: '2002',
                    message: '更新失败!',
                    data: null
                })
            } else {
                return res.json({
                    errorCode: '0000',
                    message: '更新聊天配置成功!',
                    data: null
                })
            }
        }
    } catch (error) {
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const getModelParam = async (req, res) => {


}

const putModelParam = async (req, res) => {


}

module.exports = {
    getChatParam,
    putChatParam,
    getModelParam,
    putModelParam
}