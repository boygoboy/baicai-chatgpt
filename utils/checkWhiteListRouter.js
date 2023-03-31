const Role = require('../db/models/roleSchema')
const Menu= require('../db/models/menuSchema')
const allRouterObj=require('../routes/routerlist')

async  function checkWhiteListRouter(req,res){
let whiteList=[]
let {roleNames}=req.user.userList
let resultData= await Role.find({_id: { $in: roleNames }}).exec()
let permSigns=[]
let permIds=[]
resultData.forEach(item=>{
    permIds=permIds.concat(item.permId)
   permSigns=permSigns.concat(item.permSign)
})
permSigns= Array.from(new Set(permSigns))
permIds=Array.from(new Set(permIds))
let resultMenus= await Menu.find({_id: { $in: permIds }}).exec()
resultMenus.forEach(item=>{
  allRouterObj.forEach(routerObj=>{
    if(item.url==routerObj.menuUrl){
        if(routerObj.permit==null){
            whiteList.push(routerObj.routerUrl)
        }else{
            if(permSigns.includes(routerObj.permit)){
                whiteList.push(routerObj.routerUrl)
            }
        }
    }
  })
})
whiteList.push('/api/menus/menulist')
console.log(whiteList)
return whiteList
}


module.exports={
    checkWhiteListRouter
}