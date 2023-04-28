import login from './modules/login'
import menu from './modules/menu'
import userList from './modules/user'
import role from './modules/role'
import chatgpt from './modules/chatgpt'
import chatparams from './modules/chatgpt/chatParams'
export default{
    ...login,
    ...menu,
    ...userList,
    ...role,
    ...chatgpt,
    ...chatparams
}