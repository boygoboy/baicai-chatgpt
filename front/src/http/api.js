import login from './modules/login'
import menu from './modules/menu'
import userList from './modules/user'
import role from './modules/role'
import chatgpt from './modules/chatgpt'
import chatparams from './modules/chatgpt/chatParams'
import keylist from './modules/chatgpt/resourceManage'
import interfaceRate from './modules/chatgpt/interfaceRate'
import consumerhome from './modules/homStastics/consumerhome.js'
export default{
    ...login,
    ...menu,
    ...userList,
    ...role,
    ...chatgpt,
    ...chatparams,
    ...keylist,
    ...interfaceRate,
    ...consumerhome
}