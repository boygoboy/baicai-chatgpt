const Role = require('../../db/models/roleSchema')
const Counter = require('../../db/models/counterSchema')
const pagerFun = require('../../utils/pager')
//查询角色
const rolelist = async (req,res) => {
    let { roleName, pageNum, pageSize }=req.query
    let params = {}
    let pager = {}
    if (roleName) params.roleName = roleName
    try{
        const query = Role.find(params)
        const rolelist = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await Role.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        console.log(rolelist)
        if (rolelist) { 
            return res.json({
                code: '200',
                msg: '查询角色列表成功!',
                data: { rolelist, pager }
            })
     }
        return res.json({
            code: '2001',
            msg: '查询角色列表失败!',
            data:null
        })
    }catch(error){
        res.json({
            code: '500',
            msg: '服务器错误!',
            data: error
        })
    }

}
// 新增角色
const addrole = async (req,res) => {
    let { _id, ...updataPrams } = req.body
    //新增角色
    if (!updataPrams.roleName) {
        return res.json({
            code: '2001',
            msg: '角色名不能为空!',
            data: null
        })
    }
    const result = await Role.findOne({ $or: [{ roleName:updataPrams.roleName }] })
    if (result) {
        return res.json({
            code: '2001',
            msg: '新增角色已存在!',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "roleid" })
        if (!result) {
            await Counter.create({
                "id": "roleid",
                "sequence_value": 0
            })
        }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
        const Roles = await new Role({
            roleId: count.sequence_value, ...updataPrams
        })
        await Roles.save();
        return res.json({
            code: '200',
            msg: '新增角色成功!',
            data: null
        })
    } catch (error) {
         res.json({
            code: '500',
            msg: '服务器错误!',
            data: error
        })
        throw error
    }
}

// 更新角色
const updaterole = async (req,res) => {
    let { _id, ...updataPrams } = req.body
        try {
            const userList = await Role.findOneAndUpdate({ _id }, updataPrams)
            if (userList) {
                return res.json({
                    code: '200',
                    msg: '修改成功!',
                    data:null
                })
            }
            return res.json({
                code: '2001',
                msg: '修改角色失败!',
                data: null
            })
        } catch (error) {
            return res.json({
                code: '500',
                msg: '服务器错误!',
                data: error
            })
        }
}


//删除角色（一般删除用户并非真正删除，而是改变状态，这里使用了真正的删除）
const deleterole = async (req,res) => {
    let _id=req.params.id
    if (!_id) {
        return res.json({
            code: '2001',
            msg: '参数错误',
            data: null
        })
    }
    //_id接收数组
    try {
        await Role.deleteMany({ _id: { $in: _id } })
         return res.json({
            code: '200',
            msg:'删除角色成功！',
            data: null
         })
    } catch (error) {
       res.json({
        code: '500',
        msg: '服务器错误!',
        data: error
       })
    }
}
module.exports = {
    rolelist,
    addrole,
    updaterole,
    deleterole
}