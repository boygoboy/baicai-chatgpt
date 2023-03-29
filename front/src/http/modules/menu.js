import $http from '../http'

//获取菜单列表
const menuList = (data) => {
    return $http({
        url:'/api/menus/menulist',
        method:'get',   
        data
    })
}
//删除菜单
const delMenuList = (id) => {
    return $http({
        url:`/api/menus/delMenuList/${id}`,
        method:'delete',  
    })
}
//新增菜单
const addMenuList = (data) => {
    return $http({
        url:'/api/menus/addmenulist',
        method:'post',   
        data
    })
}

// 编辑菜单
const updateMenuList = (data) => {
    return $http({
        url:'/api/menus/updatemenulist',
        method:'put',   
        data
    })
}

export default{
    menuList,
    delMenuList,
    addMenuList,
    updateMenuList
}