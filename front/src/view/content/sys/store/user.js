import user from "@/http/api"
export default {
    namespaced: true,
    state: {
        userForm: {},
        userTable: [],
        pager:{
            total:0,
            pageNum:1
        }
    },
    mutations: {
        setUserTable(state, data) {
            state.userTable = data
        },
        setPager(state,data){
            state.pager=data
        }
    },
    actions: {
        async handleQuery({commit,state}) {
            const {pageNum} = state.pager
            const { data, errorCode } = await user.userList({...state.userForm,pageNum});
            if (errorCode != "0000") return;
            commit("setUserTable", data.userList)
            commit("setPager", data.pager)
        },
        handleReset() {
            arguments[1].resetFields()
        },
      
    }
}