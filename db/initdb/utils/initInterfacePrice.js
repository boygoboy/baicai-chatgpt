const rolelist=require('../../models/roleSchema');
const interfacePrice=require('../../models/chatgpt/interfacePriceSchema');
const Counter=require('../../models/counterSchema');
const fs=require('fs');
const path = require('path');

const initInterfacePrice=async()=>{
    // 读取json文件
    const rawData = fs.readFileSync(path.join(__dirname, '../../initdb/data/interfacePrice.json'));
    const initData = JSON.parse(rawData);
    // 读取role角色列表
    const roleList = await rolelist.find().exec();
    // 读取counter计数器
    const countresult = await Counter.findOne({ id: "interfacePriceId" })
    if (!countresult) {
        await Counter.create({
            "id": "interfacePriceId",
            "sequence_value": 0
        })
    }
    // 读取interfacePrice接口速率列表
    const interfacePriceList = await interfacePrice.find().exec();
    roleList.forEach(async (role) => {
       let findInterfacePrice= interfacePriceList.findIndex(interfaceItem=>interfaceItem.roleId==role._id)
       if(findInterfacePrice!=-1){
        // 执行追加操作
        initData.forEach(async (item)=>{
            // 查找interfacePrice中是否存在该条数据,如果存在则不追加，根据type和model查找
            let findInitItemIndex=interfacePriceList.findIndex(interfaceItem=>interfaceItem.type==item.type&&interfaceItem.model==item.model)
            if(findInitItemIndex==-1){
                // 不存在则追加
                const count = await Counter.findOneAndUpdate({ id: 'interfacePriceId' }, { $inc: { sequence_value: 1 } }, { new: true })
                await interfacePrice.create({
                    interfacePriceId: count.sequence_value,
                    roleId:role._id,
                    type:item.type,
                    model:item.model,
                    count:item.count,
                    unit:item.unit,
                })
            }
        })
       }else{
        // 执行初始化操作
        initData.forEach(async (item)=>{
            const count = await Counter.findOneAndUpdate({ id: 'interfacePriceId' }, { $inc: { sequence_value: 1 } }, { new: true })
            await interfacePrice.create({
                interfacePriceId: count.sequence_value,
                roleId:role._id,
                type:item.type,
                model:item.model,
                count:item.count,
                unit:item.unit,
            })
        })
       }
    })
    // 去除interfacePrice多余的数据
    interfacePriceList.forEach(async (item)=>{
        let findRoleIndex=roleList.findIndex(roleItem=>roleItem._id==item.roleId)
        if(findRoleIndex==-1){
            // 删除
            await interfacePrice.deleteOne({interfacePriceId:item.interfacePriceId})
        }
    })
}

module.exports={
    initInterfacePrice
}