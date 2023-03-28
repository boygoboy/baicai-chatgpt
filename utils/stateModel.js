const code = {
    SUCCESS:'0000',//成功
    PARAM_ERROR: '1001', //参数错误
    USER_ACCOUNT_ERROR: '1002', //账号或密码错误  
    USER_LOGIN_ERROR: '1003',//用户未登录
    TOKEN_ERROR: '1004',//token校验失败
    ERROR:'9999',//通用错误
    DB_ERROR:'1005',//数据库操作错误
}
class baseModel {
    constructor (data,message){
        if(typeof data === 'string'){
            this.message = data
            data = null
            if(message){
                this.code = message
            }
            message = null
        }
        if(data){
            this.data = data
        }
        if(message){
            this.message = message
        }
    }
}
class successModel extends baseModel {
    constructor (data,message){
        super(data,message) 
        this.errorCode = code.SUCCESS
    }
}
class errorModel extends baseModel {
    constructor (data,message) {
        super(data,message)
        this.errorCode = this.code || code.ERROR
        delete this.code
    }
}

module.exports = {
    successModel,
    errorModel,
    code
}