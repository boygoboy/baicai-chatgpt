const Counter = require('../../db/models/counterSchema')
const interfacerate = require('../../db/models/chatgpt/interfaceRateSchema')
const interfaceprice = require('../../db/models/chatgpt/interfacePriceSchema')

const getInterfaceRateList = async (req, res) => {
    let {roleId,type }=req.query
    if(!roleId||!type)return res.json({errorCode:'2002',message:'参数缺失!',data:null})
    let params = {}
    if(roleId)params.roleId=roleId
     if(type)params.type=type
    try{
        const interfaceList = await interfacerate.find(params)
        if (interfaceList) { 
            return res.json({
                errorCode: '0000',
                message: `查询${type}接口速率列表成功!`,
                data: interfaceList
            })
     }
        return res.json({
            errorCode: '2002',
            message: `查询${type}接口速率列表失败!`,
            data:null
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
    }
}

const postInterfaceRate = async (req, res) => {
    let {roleId,type,rateData} = req.body
    if(!Array.isArray(rateData)){
        return res.json({
            errorCode: '2002',
            message: '参数格式错误!',
            data: null
        })
    }
    if (!roleId||!type) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    let postdata=[]
    rateData.forEach((item,index)=>{
        postdata.push({
            roleId,
            type,
            model:item.model,
            count:item.count,
            cycle:item.cycle,
            unit:item.unit,
        })
    })
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "interfaceRateId" })
        if (!result) {
            await Counter.create({
                "id": "interfaceRateId",
                "sequence_value": 0
            })
        }
        // 执行更新或者插入操作
        rateData.forEach(async (item,index) => {
            //处理自增userId
           const count = await Counter.findOneAndUpdate({ id: 'interfaceRateId' }, { $inc: { sequence_value: 1 } }, { new: true })
            let dataToUpsert = {
                interfaceRateId: count.sequence_value,
                roleId,
                type,
                model:item.model,
                count:item.count,
                cycle:item.cycle,
                unit:item.unit,
            };
        
            // 此处你需要定义一个查询条件，用于寻找要更新的文档。这可能是一个或多个字段的组合
            // 在这个例子中，我们只使用 "roleId" 和 "type"、model 作为唯一标识，你可能需要根据自己的业务需求修改这个查询条件
            let queryCondition = { 
                roleId: dataToUpsert.roleId,
                type: dataToUpsert.type,
                model:dataToUpsert.model
            };
            // 使用 findOneAndUpdate() 进行 upsert 操作
            await interfacerate.findOneAndUpdate(queryCondition, dataToUpsert, { upsert: true });
        });
        return res.json({
            errorCode: '0000',
            message: `配置${type}对话速率成功!`,
            data: null
        })
    } catch (error) {
         res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

const getInterfacePriceList = async (req, res) => {
    let {roleId,type }=req.query
    if(!roleId||!type)return res.json({errorCode:'2002',message:'参数缺失!',data:null})
    let params = {}
    if(roleId)params.roleId=roleId
     if(type)params.type=type
    try{
        const interfacePriceList = await interfaceprice.find(params)
        if (interfacePriceList) { 
            return res.json({
                errorCode: '0000',
                message: `查询${type}接口价格列表成功!`,
                data: interfacePriceList
            })
     }
        return res.json({
            errorCode: '2002',
            message: `查询${type}接口价格列表失败!`,
            data:null
        })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
    }
}

const postInterfacePrice = async (req, res) => {
    let {roleId,type,priceData} = req.body
    if(!Array.isArray(priceData)){
        return res.json({
            errorCode: '2002',
            message: '参数格式错误!',
            data: null
        })
    }
    if (!roleId||!type) {
        return res.json({
            errorCode: '2002',
            message: '参数缺失!',
            data: null
        })
    }
    let postdata=[]
    priceData.forEach((item,index)=>{
        postdata.push({
            roleId,
            type,
            model:item.model,
            count:item.count,
            unit:item.unit,
        })
    })
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "interfacePriceId" })
        if (!result) {
            await Counter.create({
                "id": "interfacePriceId",
                "sequence_value": 0
            })
        }
        // 执行更新或者插入操作
        priceData.forEach(async (item,index) => {
            //处理自增userId
           const count = await Counter.findOneAndUpdate({ id: 'interfacePriceId' }, { $inc: { sequence_value: 1 } }, { new: true })
            let dataToUpsert = {
                interfacePriceId: count.sequence_value,
                roleId,
                type,
                model:item.model,
                count:item.count,
                unit:item.unit,
            };
        
            // 此处你需要定义一个查询条件，用于寻找要更新的文档。这可能是一个或多个字段的组合
            // 在这个例子中，我们只使用 "roleId" 和 "type"、model 作为唯一标识，你可能需要根据自己的业务需求修改这个查询条件
            let queryCondition = { 
                roleId: dataToUpsert.roleId,
                type: dataToUpsert.type,
                model:dataToUpsert.model
            };
            // 使用 findOneAndUpdate() 进行 upsert 操作
            await interfaceprice.findOneAndUpdate(queryCondition, dataToUpsert, { upsert: true });
        });
        return res.json({
            errorCode: '0000',
            message: `配置${type}对话价格成功!`,
            data: null
        })
    } catch (error) {
         res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }
}

module.exports = {
    getInterfaceRateList,postInterfaceRate,getInterfacePriceList,postInterfacePrice
}