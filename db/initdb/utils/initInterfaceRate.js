const rolelist=require('../../models/roleSchema');
const interfaceRate=require('../../models/chatgpt/interfaceRateSchema');
const Counter=require('../../models/counterSchema');
const fs=require('fs');
const path = require('path');

const initInterfaceRate=async()=>{
    // 读取json文件
    const rawData = fs.readFileSync(path.join(__dirname, '../../initdb/data/interfaceRate.json'));
    const initData = JSON.parse(rawData);
    // 读取role角色列表
    const roleList = await rolelist.find().exec();
    // 读取counter计数器
    const countresult = await Counter.findOne({ id: "interfaceRateId" })
    if (!countresult) {
        await Counter.create({
            "id": "interfaceRateId",
            "sequence_value": 0
        })
    }
    // 读取interfaceRate接口速率列表
    const interfaceRateList = await interfaceRate.find().exec();
    roleList.forEach(async (role) => {
       let findInterfaceRate= interfaceRateList.findIndex(interfaceItem=>interfaceItem.roleId==role._id)
       if(findInterfaceRate!=-1){
        // 执行追加操作
        initData.forEach(async (item)=>{
            // 查找interfaceRateList中是否存在该条数据,如果存在则不追加，根据type和model查找
            let findInitItemIndex=interfaceRateList.findIndex(interfaceItem=>interfaceItem.type==item.type&&interfaceItem.model==item.model)
            if(findInitItemIndex==-1){
                // 不存在则追加
                const count = await Counter.findOneAndUpdate({ id: 'interfaceRateId' }, { $inc: { sequence_value: 1 } }, { new: true })
                await interfaceRate.create({
                    interfaceRateId: count.sequence_value,
                    roleId:role._id,
                    type:item.type,
                    model:item.model,
                    count:item.count,
                    cycle:item.cycle,
                    unit:item.unit,
                })
            }
        })
       }else{
        // 执行初始化操作
        initData.forEach(async (item)=>{
            const count = await Counter.findOneAndUpdate({ id: 'interfaceRateId' }, { $inc: { sequence_value: 1 } }, { new: true })
            await interfaceRate.create({
                interfaceRateId: count.sequence_value,
                roleId:role._id,
                type:item.type,
                model:item.model,
                count:item.count,
                cycle:item.cycle,
                unit:item.unit,
            })
        })
       }
    })
    // 去除interfaceRate多余的数据
    interfaceRateList.forEach(async (item)=>{
        let findRoleIndex=roleList.findIndex(roleItem=>roleItem._id==item.roleId)
        if(findRoleIndex==-1){
            // 删除
            await interfaceRate.deleteOne({interfaceRateId:item.interfaceRateId})
        }
    })
}

module.exports={
    initInterfaceRate
}