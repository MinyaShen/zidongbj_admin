layui.use(['form', 'layer'], function () {
    var form = layui.form;
    // 选择点位
    form.on('select(point)', function (data) { //对应lay-filter
        //sex= data.value;                                   //获取value值
        //text= data.elem[data.elem.selectedIndex].text;;    //获取显示的值
        //console.log(data.value)
        getLinecharData(data.value);
    });
    // 选择年份
    form.on('select(time)', function (data) { //对应lay-filter
        //sex= data.value;                                   //获取value值
        //text= data.elem[data.elem.selectedIndex].text;;    //获取显示的值
        console.log(data.value)
        getPiecharData(data.value);
    });
})
getLinecharData() //初始化调用折线图数据
getPiecharData() //初始化调用饼状图数据


// pc端首页数据分析，数据总览以及点位类别统计、地图接口
$.ajax({
    url: baseUrl + "/report/reportPc",
    method: 'GET',
    contentType: 'application/json',
    success: function (res) {
        console.log(res.data)
        $('#clientCount').text(res.data.clientCount); //网点数量
        $('#maintainCount').text(res.data.maintainCount); //待维修网点
        $('#zoneCount').text(res.data.zoneCount); //设备总数
        $('#rocordCount').text(res.data.rocordCount); //本月维保数

        // 使用点位类别统计分析
        var tempTypeCount = res.data.typeCount;
        let frangment = '';
        for (let i = 0; i < tempTypeCount.length; i++) {
            var temp = "<li><span class='icon'><i class='iconfont'>&#xe6a4;</i></span><p class='text'>" + tempTypeCount[i].type + "</p><p class='count'>" + tempTypeCount[i].val + "</p>"
            frangment += temp;
        }
        $('#typeCount').html(frangment)

        // 缴费比例统计分析
        var tempExpirCount = res.data.expirCount;
        let data = []
        for (let i = 0; i < tempExpirCount.length; i++) {
            let tempobj = {}
            if (tempExpirCount[i].status == 0) {
                tempobj.value = tempExpirCount[i].count
                tempobj.name = '已缴费'
            } else if (tempExpirCount[i].status == 1) {
                tempobj.value = tempExpirCount[i].count
                tempobj.name = '未缴费'
            }
            data.push(tempobj)
        }
        renderPieChar1(data)
    }
});


//报警数据分析统计
//获取所有绑定点位信息进行下拉选框的赋值
$.ajax({
    url: baseUrl + "/client/clientIdNameList",
    method: 'GET',
    contentType: 'application/json',
    success: function (res) {
        let tempData = res.data;
        let frangment = "<option value=''>全部</option>";
        for (let i = 0; i < tempData.length; i++) {
            var temp = "<option value=" + tempData[i].key + "> " + tempData[i].value + "</option>"
            frangment += temp;
        }
        $('#clientIdNameList').html(frangment)
        console.log('此时进行了选项插入')
    }
});
//获取pc端维修折线图数据
function getLinecharData(param) {
    $.ajax({
        url: baseUrl + "/report/reportPcMaintainLine",
        method: 'GET',
        data: {
            clientId: param
        },
        contentType: 'application/json',
        success: function (res) {
            // 对图表右侧数据进行赋值
            $('#normalRocordCount').text(res.data.normalRocordCount)
            $('#humanRocordCount').text(res.data.humanRocordCount)

            // 处理折线图数据类型
            let temp = res.data.list;
            let xAxisData = [];
            let seriesData = []
            //人为故障
            let tempObj1 = {
                name: '人为故障',
                type: 'line',
                stack: '总量',
                data: []
            }
            //一般故障
            let tempObj2 = {
                name: '一般故障',
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        color: '#36BBB5', //改变折线点的颜色
                        lineStyle: {
                            color: '#36BBB5' //改变折线颜色
                        }
                    }
                },
                data: []
            }

            for (let i = 0; i < temp.length; i++) {
                xAxisData.push(temp[i].dateStr); //将X轴年份遍历出来
                if (temp[i].damageType == 1) {
                    tempObj1.data.push(temp[i].val)
                } else if (temp[i].damageType == 2) {
                    tempObj2.data.push(temp[i].val)
                }
            }
            seriesData.push(tempObj1)
            seriesData.push(tempObj2)
            renderLineChar(xAxisData, seriesData)
        }
    });
}

//获取pc端维饼状图数据
function getPiecharData(param) {
    $.ajax({
        url: baseUrl + "/report/reportPcLevelPins",
        method: 'GET',
        data: {
            year: param
        },
        contentType: 'application/json',
        success: function (res) {
            console.log(res.data)
            let tempData = res.data.years;
            let frangment = "<option value=''></option>";
            for (let i = 0; i < tempData.length; i++) {
                var temp = "<option value=" + tempData[i] + "> " + tempData[i] + "</option>"
                frangment += temp;
            }
            $('#reportPcLevelPins').html(frangment)
            console.log('此时进行了选项插入')

            // 点评星级统计分析
            let tempList = res.data.list;
            let data = [{
                    value: 0,
                    name: '2星及以下'
                },
                {
                    value: 0,
                    name: '2-3星'
                },
                {
                    value: 0,
                    name: '3-4星'
                },
                {
                    value: 0,
                    name: '5星'
                },
            ]
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i].lev <= 2) {
                    data[0].value++;
                } else if (tempList[i].lev <= 3 && tempList[i].lev > 2) {
                    data[1].value++;
                } else if (tempList[i].lev <= 4 && tempList[i].lev > 3) {
                    data[2].value++;
                } else if (tempList[i].lev == 5) {
                    data[3].value++;
                }
            }
            renderPieChar2(data)
        }
    });
}


//===========================================//
// 折线图
// 基于准备好的dom，初始化echarts实例
function renderLineChar(xAxisData, seriesData) {
    var alarmLineChart = echarts.init(document.getElementById('alarmLineChart'));
    // 指定图表的配置项和数据
    var option1 = {
        title: {
            text: '折线图堆叠'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['人为故障', '一般故障']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#666',
                }
            },
            data: xAxisData
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#666',
                }
            }
        },
        series: seriesData
    };

    // 使用刚指定的配置项和数据显示图表。
    alarmLineChart.setOption(option1);
}


// 饼状图
// 基于准备好的dom，初始化echarts实例
function renderPieChar1(data) {
    var expirCount = echarts.init(document.getElementById('expirCount'));
    // 指定图表的配置项和数据
    var option2 = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            left: '80%',
            top: 'center',
            orient: 'vertical',
            data: ['已缴费', '未缴费']
        },
        color: ['#fd7270', '#2fb6da'],
        toolbox: {
            show: true,
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: [{
            name: '状态信息',
            type: 'pie',
            radius: [20, 110],
            center: ['40%', '50%'],
            roseType: 'radius',
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true
                }
            },
            data: data
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    expirCount.setOption(option2);
}




function renderPieChar2(data) {
    var levelPins = echarts.init(document.getElementById('levelPins'));
    // 指定图表的配置项和数据
    var option3 = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            left: '80%',
            top: 'center',
            orient: 'vertical',
            data: ['2星以下', '2-3星', '3-4星', '5星']
        },
        color: ['#367BBB', '#FE787A', '#ED9935', '#36BBB5', '#BB3636'],
        toolbox: {
            show: true,
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: [{
            name: '状态信息',
            type: 'pie',
            radius: [20, 110],
            center: ['40%', '50%'],
            roseType: 'radius',
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true
                }
            },
            data: data
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    levelPins.setOption(option3);
}


//地图数据
// function initMap() {
//     var map = new qq.maps.Map(document.getElementById("qqMap"), {
//         // 地图的中心地理坐标。
//         center: new qq.maps.LatLng(39.916527, 116.397128)
//     });
// }
// initMap();