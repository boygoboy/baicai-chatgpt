import Mock from 'mockjs'
import * as Login from './mockers/login'
const mockUrl=process.env.VUE_APP_PATH

createMock(Login)
function createMock(mok) {
    for (let key in mok) {
        (res => {
            console.log(mockUrl+res.url)
            Mock.mock((mockUrl+res.url), res.methods, res.data)

        })(mok[key]())
    }
}
export default Mock