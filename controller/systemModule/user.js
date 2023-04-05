const User = require('../../db/models/userSchema')
const Counter = require('../../db/models/counterSchema')
const Role = require('../../db/models/roleSchema')
const pagerFun = require('../../utils/pager')
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const { secret } = require('../../config/config')

const login = (req, res) => {
    const { username, password } = req.body
    //查询数据库
    User.findOne({ username: username, password: md5(password + md5(secret)) }, (err, data) => {
        let userList=data
        //判断
        if (err) {
            res.json({
                errorCode: '1005',
                message: '数据库读取失败!',
                data: null
            })
            return
        }
        //判断 data
        if (!data) {
            return res.json({
                errorCode: '1002',
                message: '用户名或密码错误!',
                data: null
            })
        }

        Role.find({ _id: data.roleNames }, (err, data) => {
            //判断
            if (err) {
                res.json({
                    errorCode: '1005',
                    message: '数据库读取失败!',
                    data: null
                })
                return
            }
            //判断 data
            if (!data) {
                return res.json({
                    errorCode: '1001',
                    message: '角色列表为空！',
                    data: null
                })
            }
            //按钮权限返回
            let permSign = []
            if (data.length) {
                for (let i in data) {
                    permSign = permSign.concat(data[i].permSign)
                }
            }
            //创建当前用户的 token
            let token = jwt.sign({
                userList
            }, secret, {
                expiresIn: 60 * 60 * 24
            });

            //响应 token
            res.json({
                errorCode: '0000',
                message: '登录成功!',
                data: {
                    token,
                    permSign
                }
            })
        })
    })
}


const userlist = async (req,res) => {
    let params = {}
    let pager = {}
    const { username, mobile, pageNum, pageSize} = req.query
    if (username) params.username = username
    if (mobile) params.mobile = mobile
    try {
        const query =  User.find(params)
        const userList = await query.skip(pagerFun(pageNum, pageSize).skipIndex).limit(pagerFun(pageNum, pageSize).pager.pageSize)
        const total = await User.countDocuments(params)
        pager.total = total
        pager.pageNum = parseInt(pageNum)
        if (userList) {
            return res.json({
                errorCode: '0000',
                message: '查询用户列表成功!',
                data: { userList, pager }
            })
        } else {
            return res.json({
                errorCode: '1002',
                message: '用户名或者密码失败!',
                data: null
            })
        }
    } catch (error) {
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }

}

const createFirstUser = async (params) => {
    const result = await User.findOne({
         username: process.env.ADMIN_NAME|| "admin" 
        })
    if (result) {
        return
    }
    const user = await new User({
        userId: 0, ...params
    })
    await user.save();
}


const addlist = async (req, res) => {
    let { _id,password,role, ...params } = req.body
    role=99
    //新增用户
    if(!params.username || !params.mobile || !params.userEmail || !password) {
        return res.json({
            errorCode: '2002',
            message: '参数错误',
            data: null
        })
    }
    const result = await User.findOne({ $or: [{ username: params.username }, { userEmail: params.userEmail }] })
    if (result) {
        return res.json({
            errorCode: '2002',
            message: '用户名或者邮箱已存在',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "userId" })
        if (!result) {
            await Counter.create({
                "id": "userId",
                "sequence_value": 1
            })
        }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
        const user = await new User({
            userId: count.sequence_value,password: md5(password + md5(secret)),role, ...params
        })
        await user.save();
        res.json({
            errorCode: '0000',
            message: '新增用户成功!',
            data: null
        })
    } catch (error) {
        res.json({
            errorCode: '500',
            message: '服务器错误',
            data: error
        })
    }
}

// 用户注册
const registerUser= async(req,res)=>{
    let { _id,password,role, ...params } = req.body
    //新增用户
    if(!params.username  || !params.userEmail || !password) {
        return res.json({
            errorCode: '2003',
            message: '参数错误',
            data: null
        })
    }
    const result = await User.findOne({ $or: [{ username: params.username }, { userEmail: params.userEmail }] })
    if (result) {
        return res.json({
            errorCode: '2003',
            message: '用户名或者邮箱已存在',
            data: null
        })
    }
    try {
        //这一步运行一次就可以注释掉，自增需要有个初始值
        const result = await Counter.findOne({ id: "userId" })
        if (!result) {
            await Counter.create({
                "id": "userId",
                "sequence_value": 1
            })
        }
        //处理自增userId
        const count = await Counter.findOneAndUpdate({ id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
    //   赋予普通用户角色
        const roleresult=await Role.findOne({roleName:'普通用户'})
        let roleNames=[]
       if(roleresult){
         roleNames=[roleresult._id]
       }
        const user = await new User({
            userId: count.sequence_value,password: md5(password + md5(secret)),role:99,roleNames, ...params
        })
        await user.save();
        res.json({
            errorCode: '0000',
            message: '新增用户成功!',
            data: null
        })
    } catch (error) {
        res.json({
            errorCode: '500',
            message: '服务器错误',
            data: error
        })
    }
}

// 更新用户
const updatelist = async (req, res) => {
    let { _id,password, ...params } = req.body
        try {
            const result=await User.findOne({_id})
            if(result){
             if(result.role==0){
                return res.json({
                    errorCode: '2002',
                    message: '超级管理员不允许修改!',
                    data:null
                })
             }
            }else{
                return res.json({
                    errorCode: '2002',
                    message: '用户不存在!',
                    data: null
                })
            }
            const userList = await User.findOneAndUpdate({ _id }, {password: md5(password + md5(secret)), ...params })
            if (userList) {
                res.json({
                    errorCode: '0000',
                    message: '修改用户成功!',
                    data: null
                })
                return
            }
            return res.json({
                errorCode: '2002',
                message: '修改用户失败!',
                data: null
            })
        } catch (error) {
            res.json({
                errorCode: '500',
                message: '服务器错误!',
                data: error
            })
            throw error
        }
}
//删除用户（一般删除用户并非真正删除，而是改变状态，这里使用了真正的删除）
const dellist = async (req, res) => {
     let _id = req.params.id.split(',');
     
    if (_id.length==0) {
        return res.json({
            errorCode: '2002',
            message: '参数错误!',
            data: null
        })
    }
    const result=await User.findOne({role:0})
    if(result){
     if(_id.includes(result._id.toString())){
        return res.json({
            errorCode: '2002',
            message: '超级管理员不允许删除!',
            data:null
        })
     }
    }else{
        return res.json({
            errorCode: '2002',
            message: '用户不存在!',
            data: null
        })
    }
    //_id接收数组
    try {
        const result = await User.deleteMany({ _id: { $in: _id } })
        return res.json({
            errorCode: '200',
            message: `删除成功${result.deletedCount}条`,
            data: null
        })
    } catch (error) {
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
    }

}
// 禁用or启用用户
const isactiveuser = async (req, res) => {
      let {_id,active}=req.body
      try{ 
        const userList = await User.findOneAndUpdate({_id},{active})
        if(userList.username === process.env.ADMIN_NAME){
            return res.json({
                errorCode: '2002',
                message: '超级管理员不可禁用!',
                data: null
            })
        }
        if (userList) {
            res.json({
                errorCode: '200',
                message: '操作成功!',
                data: null
            })
            return
        }
        return res.json({
            errorCode: '2002',
            message: '操作失败!',
            data: null
        })
      }catch(error){
        res.json({
            errorCode: '500',
            message: '服务器错误!',
            data: error
        })
        throw error
      }
}
module.exports = {
    login,
    userlist,
    addlist,
    updatelist,
    dellist,
    createFirstUser,
    isactiveuser,
    registerUser
}