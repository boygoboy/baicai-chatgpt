import $http from '../http'
const login = (data) => {
    return $http({
        url:'/api/user/login',
        method:'post',
        data
    })
}
const register=(data)=>{
    return $http({
        url:'/api/user/register',
        method:'post',
        data
    })
}

const  sendEmailCode=(data)=>{
    return $http({
        url:'/api/auth/emailcode',
        method:'post',
        data
    })
}

const checkIsUser=(data)=>{
    return $http({
        url:'/api/auth/hasuser',
        method:'post',
        data
    })
}
export default{
    login,register,sendEmailCode,checkIsUser
}