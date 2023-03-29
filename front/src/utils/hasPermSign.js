/**判断是否具有按钮权限 
 * @param {String} prem-权限字符串
*/
import Store from "@/store";
export default function (prem) {
    const permSign = Store.state.permSign.permSign
    if (permSign.indexOf(prem) == -1) {
        return true
    }
    return false

}