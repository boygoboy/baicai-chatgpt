export function login(){
    return {
        url: '/login',
        methods: 'post',
        data: {
            errorCode: '0000',
            msg:'请求成功',
            data:{
                token:12312
            }
        }
    }
}
export function loginOut(){
    return {
        url: '/loginOut',
        methods: 'post',
        data: {
            errorCode: '0000',
            msg:'请求成功'
        }
    }
}