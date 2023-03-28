var express = require('express');
var router = express.Router();
const {addMenus,updateMenus,queryMenus,delMenuList} = require("../../controller/systemModule/menus")

router.get("/menulist", (req,res)=>{
    queryMenus(req,res)
})
router.post("/addmenulist", (req,res)=>{
     addMenus(req,res)
})
router.put("/updatemenulist", (req,res)=>{
    updateMenus(req,res)
})
//删除菜单
router.delete("/delMenuList/:id", (req,res)=>{
    delMenuList(req,res)
})

module.exports = router