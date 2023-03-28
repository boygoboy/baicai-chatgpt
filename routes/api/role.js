var express = require('express');
var router = express.Router();
const {addrole, updaterole, rolelist, deleterole } = require("../../controller/systemModule/role")
router.get("/rolelist", (req,res) => {
     rolelist(req,res)
})
router.post("/addrole",  (req,res) => {
    addrole(req,res)
})
router.put("/updaterole",  (req,res) => {
    updaterole(req,res)
})
//删除角色
router.delete("/deleterole/:id",  (req,res) => {
    deleterole(req,res)
})

module.exports = router