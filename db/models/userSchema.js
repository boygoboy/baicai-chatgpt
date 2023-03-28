// 用户表
const mongoose = require('mongoose');
const userSchema =mongoose.Schema({
    "userId": Number,
    "username": {
        type: String,
        required: true
    },
    "password": {
        type: String,
        required: true
    },
    "realname": String,
    "userEmail" : String,//用户邮箱
    "mobile":String,//手机号
    "sex":Number,//性别 0:男  1：女 
    "roleNames":[],//角色 0:超级管理员 1:管理员 3:运营 4:技术
    "role": {
        type:Number,
        default:99
    }, // 用户角色 0：系统管理员  1： 普通用户
    "active":{
        type:Boolean,
        default:true
    },
    //"roleList" : [], //系统角色
    "createTime" : {
        type:String,
        default:new Date().getTime()
    },//创建时间
    "updateTime" : {
        type:String,
        default:new Date().getTime()
    }//更新时间
})
const user = mongoose.model('users', userSchema,'users')
module.exports = user