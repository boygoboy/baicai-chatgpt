import $http from '../http'
//查询用户列表
const userList = (data) => {
    return $http({
        url:'/api/user/userlist',
        method:'get',
        data
    })
}
//删除用户
const dellist = (id) => {
    return $http({
        url:`/api/user/dellist/${id}`,
        method:'delete'
    })
}
//添加
const addUser = (data) => {
    return $http({
        url:'/api/user/addlist',
        method:'post',
        data
    })
}
// 编辑
const editUser=(data)=>{
    return $http({
        url:'/api/user/updatelist',
        method:'put',
        data
    })
}

export default{
    userList,
    dellist,
    addUser,
    editUser
}