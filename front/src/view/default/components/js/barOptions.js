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
        formatter: "{b} <br/>{a}: {c}行"
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
        data: ['1号','2号','3号','4号','5号','6号','7号','8号','9号','10号','11号','12号','13号','14号','15号','16号','17号','18号','19号','20号','21号','22号','23号','24号','25号','26号','27号','28号','29号','30号','31号'],
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
        name: '增长',
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
        data: [100, 120, 80, 123, 96, 89, 152, 114, 120, 119,50,60,70,80,9,10,100,200,50,80,90,70,60,90,300,200,10,60,80,200,40,70]
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
        formatter: "{b} <br/>{a}: {c}行"
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
        data: ['1号','2号','3号','4号','5号','6号','7号','8号','9号','10号','11号','12号','13号','14号','15号','16号','17号','18号','19号','20号','21号','22号','23号','24号','25号','26号','27号','28号','29号','30号','31号'],
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
        name: '增长',
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
        data: [100, 120, 80, 123, 96, 89, 152, 114, 120, 119,50,60,70,80,9,10,100,200,50,80,90,70,60,90,300,200,10,60,80,200,40,70]
    }]
}