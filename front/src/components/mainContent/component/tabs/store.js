import Router from '@/router'
import { setItem} from "@/utils/storage";
export default {
    namespaced: true,
    state: {
        bars: {
            tabsValue: "0",
            id:0,
            tabsList: [
                
            ]
        }

    },
    mutations:{
        setBars(state,data){
            state.bars=data
        }
    },
    actions:{
        //增加tab
        addTabs({state},item){
            let index = state.bars.id.toString()
            state.bars.tabsList.push({
                title: item.name,
                name: index,
            })
            state.bars.tabsValue=index
            state.bars.id++
            
        },
        handleTabsClick(){
            Router.push({name:arguments[1].label})
           
        },
        //删除tab
        removeTab({state},item){
            let barList = state.bars.tabsList;
            const index = barList.findIndex((bar)=>{
                return bar.name === item
            })
            barList.splice(index, 1)
            console.log(barList)
            setItem("bars", state.bars);
            //删除tabs跳转最后一个标签 如果不是当前选择页面或没有tab则不做跳转
            if(state.bars.tabsValue !=item || barList.length==0) return
            Router.push({name:barList[barList.length-1].title})
        }
    }
}