import $http from '../../http'
const getInterfaceRateList=(query)=>{
    return $http({
        url:'/api/chatgpt/interfaceratelist',
        method:'get',
        data:query
    })
}

const postInterfaceRate=(data)=>{
    return $http({
        url:'/api/chatgpt/interfaceratelist',
        method:'post',
        data
    })
}

const getInterfacePriceList=(query)=>{
    return $http({
        url:'/api/chatgpt/interfacepricelist',
        method:'get',
        data:query
    })
}
const postInterfacePrice=(data)=>{
    return $http({
        url:'/api/chatgpt/interfacepricelist',
        method:'post',
        data
    })
}

export default {
    getInterfaceRateList,postInterfaceRate,getInterfacePriceList,postInterfacePrice
}