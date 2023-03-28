//菜单递归
function getMenuTree(menuItem, id, list) {
   
    for (let i in menuItem) {
        let item = menuItem[i]
        
        if (String(id) == String(item.parentId)) {
         
            //item为mongodb的专属json无法更改。需要push item._doc
            list.push(item._doc)

        }
    }
    list.map(item => {
        item.children = []
        getMenuTree(menuItem, item._id, item.children)
        if (item.children.length == 0) {
            delete item.children
        }
    })
    return list
}
//递归删除菜单
function delMenuTree(menuItem, id, list) {
    let delItem = menuItem;
    list.push(id)
    for (let i in delItem) {
        let item = delItem[i]
        if ((String(item.parentId) == String(id) && item.parentId)) {
            list.push(item._id)
            //置空当前对象，否则会进死循环
            delItem[i]={}
            delMenuTree(delItem, String(item._id), list)

        }

    }
    return list
}
module.exports = { getMenuTree, delMenuTree }