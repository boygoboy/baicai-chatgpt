export function user(){
    return {
        url: '/user',
        methods: 'post',
        data: {
            errorCode: '0000',
            msg:'请求成功',
            data:{
                name:'Lili',
                sex:'0'
            }
        }
    }
}