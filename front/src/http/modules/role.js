import $http from '../http'
//查询角色列表
const roleList = (data) => {
    return $http({
        url:'/api/role/rolelist',
        method:'get',
        data
    })
}
//新增角色
const addRoleList = (data) => {
    return $http({
        url:'/api/role/addrole',
        method:'post',
        data
    })
}
// 编辑角色
const editRoleList=(data)=>{
    return $http({
        url:'/api/role/updaterole',
        method:'put',
        data
    })
}

//删除角色
const delroleList = (id) => {
    return $http({
        url:`/api/role/deleterole/${id}`,
        method:'delete',
    })
}
export default {
    roleList,
    addRoleList,
    delroleList,
    editRoleList
}