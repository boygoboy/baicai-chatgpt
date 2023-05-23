
const {initInterfaceRate}=require('./utils/initInterfaceRate.js')
const {initInterfacePrice}=require('./utils/initInterfacePrice.js')
const initdb=()=>{
    // 初始化接口速率数据
    initInterfaceRate()
    // 初始化接口价格数据
    initInterfacePrice()
}

module.exports={
    initdb
}