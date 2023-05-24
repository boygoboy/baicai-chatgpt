
const userlist=require('../../models/userSchema');
const modelparam=require('../../models/modelParmSchema');
const Counter=require('../../models/counterSchema');
const fs=require('fs');
const path = require('path');

const initgptParams = async () => {
    // 读取json文件
    const rawData = fs.readFileSync(path.join(__dirname, '../../initdb/data/gptParams.json'));
    const initData = JSON.parse(rawData);
    // 读取userlist用户列表
    const userList = await userlist.find().exec();
    // 读取counter计数器
    let countresult = await Counter.findOne({ id: "modelparamId" })
    if (!countresult) {
      await Counter.create({
        "id": "modelparamId",
        "sequence_value": 0
      })
    }
    // 读取modelparam模型参数列表
    const modelparamList = await modelparam.find().exec();
  
    for (let user of userList) {
      let findModelparam = modelparamList.findIndex(modelparamItem => modelparamItem.userId == user.userId)
      if (findModelparam != -1) {
        // 执行追加操作
        for (let item of initData) {
          // 查找moelParam中是否有一条配置数据，如果有则不追加，根据model和parameter查找，如果没有则追加
          let findInitItemIndex = modelparamList.findIndex(modelItem => modelItem.model == item.model && modelItem.parameter == item.parameter)
          if (findInitItemIndex == -1) {
            // 不存在则追加
            const count = await Counter.findOneAndUpdate({ id: 'modelparamId' }, { $inc: { sequence_value: 1 } }, { new: true })
            await modelparam.create({
              modelparamId: count.sequence_value,
              userId: user.userId,
              type: item.type,
              model: item.model,
              parameter: item.parameter,
              range: item.range,
              value: item.value,
              description: item.description
            })
          }
        }
  
      } else {
        // 执行初始化操作
        for (let item of initData) {
          const count = await Counter.findOneAndUpdate({ id: 'modelparamId' }, { $inc: { sequence_value: 1 } }, { new: true })
          await modelparam.create({
            modelparamId: count.sequence_value,
            userId: user.userId,
            type: item.type,
            model: item.model,
            parameter: item.parameter,
            range: item.range,
            value: item.value,
            description: item.description
          })
        }
      }
    }
  
    let result = await modelparam.find().sort({ model: 1, userId: 1 });
    return result; // 返回
}  

module.exports={
    initgptParams
}