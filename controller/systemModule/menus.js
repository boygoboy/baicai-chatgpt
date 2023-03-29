const Menus = require('../../db/models/menuSchema')
const Role = require('../../db/models/roleSchema')
const Counter = require('../../db/models/counterSchema')
const { getMenuTree, delMenuTree } = require('../../utils/operatMenu')
const jwt = require('jsonwebtoken');
const { secret } = require('../../config/config');
//查询菜单列表

const queryMenus = async (req, res) => {
    try{
        let params=req.query
        //从token中获取用户列表
        const { userList } = jwt.verify(req.get('token'), secret)
        //查询
        const resRole = await Role.find({ _id: { $in: userList.roleNames } })
        let menuIds = []
        resRole.forEach((item) => {
            menuIds = menuIds.concat(item.permId)
        })
        let { menuType, _ids, menuNum } = params
        if (_ids) {
            _ids = JSON.parse(_ids)
        }
        let selectParms = {}
        let conditionParms = {}
        if (menuType == 1) {
            selectParms.menuType = 1
        }

        //如果用户名为admin 默认获取全部菜单权限
        if (menuNum || userList.username ==  process.env.ADMIN_NAME || userList.username =='admin') {
            if (userList.username == process.env.ADMIN_NAME||userList.username == 'admin') {
                //创建菜单管理菜单 便于创建后续菜单,运行一次后可注释掉  
                const exitMenu = await Menus.findOne({ name: '菜单管理' })
                if (!exitMenu) {
                    await Menus.create({
                        id: 0,
                        menuType: 1,
                        url: '/sys/menu',
                        name: '菜单管理',
                        icon:'el-icon-menu',
                        parentId:null,
                    })
                }
            }
            conditionParms = {}
        } else {
            conditionParms = { _id: { $in: menuIds } }
        }
        const result = await Menus.find({ ...selectParms, ...conditionParms }).sort({ 'orderNum': 1 })//根据orderNum排序
        if (result) {
            const menuArr = getMenuTree(result, null, [])
            return res.json({
                errorCode: '0000',
                message: '查询成功!',
                data: menuArr
            })
        }
        return res.json({
            errorCode: '9999',
            message:'查询失败!'
        })
    }catch(error){
        res.json({
            errorCode:'500',
            message:'系统出错！',
            data:error
        })
    }
    
}
//新增编辑菜单
const addMenus = async (req,res) => {
    const { menuType, name, url, icon, limitCode, parentId, orderNum, level, updateTime} = req.body
    const body = { menuType, name, url, icon, limitCode, parentId, orderNum, level, updateTime }
    //新增
        try {
            //这一步运行一次就可以注释掉，自增需要有个初始值
            const result = await Counter.findOne({ id: "menuId" })
            if (!result) {
                await Counter.create({
                    "id": "menuId",
                    "sequence_value": 1
                })
            }
            const doc = await Counter.findOneAndUpdate({ id: 'menuId' }, { $inc: { sequence_value: 1 } }, { new: true })
            if (!doc) {
                return res.json({
                    errorCode: '9999',
                    message: '新增菜单失败!',
                    data:null
                })
            }
            await Menus.create({ id: doc.sequence_value, ...body })
            return res.json({
                errorCode: '0000',
                message: '新增菜单成功!',
                data:null
            })
        } catch (error) {
            res.json({
                errorCode: '500',
                message:'系统出错！',
                data:null
            })
            throw error
        }
}
// 更新菜单
const updateMenus=async (req,res)=>{
    const { menuType, name, url, icon, limitCode, parentId, orderNum, level, updateTime, _id} = req.body
    const body = { menuType, name, url, icon, limitCode, parentId, orderNum, level, updateTime }
    //编辑
    try {
        const result = await Menus.findOneAndUpdate({ _id }, body)
        if (!result) {
            return res.json({
                errorCode: '9999',
                message: '更新菜单失败!',
                data:null
            })
        }
        return res.json({
            errorCode: '0000',
            message: '更新菜单成功!',
            data:null
        })
    } catch (error) {
        res.json({
            errorCode: '500',
            message:'系统出错！',
            data:null
        })
        throw error
    }
}

//删除菜单
const delMenuList = async (req,res) => {
    try{
        let _id=req.params.id
    const result = await Menus.find()
    const _ids = delMenuTree(result, _id, [])
    const delIts = await Menus.deleteMany({ _id: _ids })
    if (delIts&&delIts.deletedCount) {
        return res.json({
            errorCode: '0000',
            message: '删除成功!',
            data:null
        })
    }
    res.json({
        errorCode: '9999',
        message: '删除失败!',
        data:null
    })
    }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器出错!',
            data:error
        })
        throw error
    }
}
module.exports = { queryMenus, addMenus,updateMenus, delMenuList }
