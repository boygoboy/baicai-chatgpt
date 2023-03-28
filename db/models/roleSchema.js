const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    roleName: String,
    remark: String,
    permSign: {
        type:[],
        default:[]
    },//权限标识
    permId: {
        type:[],
        default:[]
    },//角色菜单集合
    checkedKeys:{
        type:[],
        default:[]
    },//角色选中子节点集合
    updateTime: {
        type: Date,
        default: Date.now()
    },
    createTime: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("roles", userSchema, "roles")