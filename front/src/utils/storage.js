const MODULEKEY = process.env.VUE_APP_NAME
/**
    * 
    * @param {string} key 
    * @param {*} val 
    */
const setItem = function (key, val) {
    let setList = getStorage(MODULEKEY) || {}
    setList[key] = val
    sessionStorage.setItem(MODULEKEY, JSON.stringify(setList))
}
const getItem = function (key) {
    let getList = JSON.parse(sessionStorage.getItem(MODULEKEY)) || {}

    return getList[key]
}
const removeAll = function () {
    sessionStorage.clear()
}
const removeItem = function (key) {
    let removeList = getStorage(MODULEKEY)
    delete removeList[key]
    sessionStorage.setItem(MODULEKEY, JSON.stringify(removeList))
}
const getStorage = function (key) {
    let getList = JSON.parse(sessionStorage.getItem(key))
    return getList
}
export {
    setItem,
    getItem,
    removeAll,
    removeItem
    
}