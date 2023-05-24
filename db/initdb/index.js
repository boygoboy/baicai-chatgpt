
const {initInterfaceRate}=require('./utils/initInterfaceRate.js')
const {initInterfacePrice}=require('./utils/initInterfacePrice.js')
const {initgptParams}=require('./utils/initgptParams.js')
const initdb=()=>{
    // 初始化接口速率数据
    initInterfaceRate()
    // 初始化接口价格数据
    initInterfacePrice()
    // 初始化gpt聊天模型参数
    initgptParams()
}

module.exports={
    initdb
}