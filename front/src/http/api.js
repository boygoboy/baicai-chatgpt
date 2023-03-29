import login from './modules/login'
import menu from './modules/menu'
import userList from './modules/user'
import role from './modules/role'
export default{
    ...login,
    ...menu,
    ...userList,
    ...role
}