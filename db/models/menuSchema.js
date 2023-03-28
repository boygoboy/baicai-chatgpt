//菜单表
const mongoose = require("mongoose")
const menuSchema = mongoose.Schema({
    id: {
        required: true,
        type: Number
    },
    menuType: {
        type: Number,
        default: 1
    },//菜单类型 1：菜单 2：按钮 
    name: {
        type: String,
        required: true
    },//名称
    url: {
        type: String,
        default:''
    },//路由
    icon: {
        type:String,
        default:''
    },//图标
    limitCode: String,//权限标识
    parentId:{
        type:mongoose.Types.ObjectId,
        default:null
    },//父菜单id
    orderNum: {
        type: Number,
        default: new Date().getTime()
    },//菜单排序
    level:String,//菜单级别
    //children:{},
    createTime: {
        type: String,
        default: new Date().getTime()
    },//创建时间
    updateTime: {
        type: String,
        default: new Date().getTime()
    }//更新时间
})
const menus = mongoose.model("menus", menuSchema)
module.exports = menus