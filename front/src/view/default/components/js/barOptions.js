export const countOption={
    title: {
        text: '近一个月对话次数',
        left: 'center',
           textStyle: {
            color: '#b56eff' // 设置标题颜色为 '#b56eff'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{b} <br/>{a}: {c}次"
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top:'20%',
        containLabel: true
    },
    legend: {
        show: false
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLine: {
            lineStyle: {
                color: '#666666'
            }
        },
        axisTick: {
            show: false
        },
    },
    yAxis: {
        show: true,
        type: 'value',
        name: '次',
        axisLine: {
            lineStyle: {
                color: '#666666'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: true
        },
        splitLine: {
            show: true,
        }
    },
    series: [{
        name: '对话',
        type: 'bar',
        barWidth: '30%',
        itemStyle: {
            color: '#006CED'
        },
         label: {
            show: true,
            position: 'top',
            color: '#000',
            formatter: function(params) {
               return params.dataIndex % 2 === 0 ? params.data : '';
            }
        },
        data: []
    }]
}

export const moneyOption={
    title: {
        text: '近一个月积分使用',
        left: 'center',
           textStyle: {
            color: '#b56eff' // 设置标题颜色为 '#b56eff'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{b} <br/>{a}: {c}分"
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top:'20%',
        containLabel: true
    },
    legend: {
        show: false
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLine: {
            lineStyle: {
                color: '#666666'
            }
        },
        axisTick: {
            show: false
        },
    },
    yAxis: {
        show: true,
        type: 'value',
        name: '个',
        axisLine: {
            lineStyle: {
                color: '#666666'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: true
        },
        splitLine: {
            show: true,
        }
    },
    series: [{
        name: '使用',
        type: 'bar',
        barWidth: '30%',
        itemStyle: {
            color: '#006CED'
        },
         label: {
            show: true,
            position: 'top',
            color: '#000',
            formatter: function(params) {
               return params.dataIndex % 2 === 0 ? params.data : '';
            }
        },
        data: []
    }]
}