import { players, history } from '../main.js';

var assetChart;
var cashChart;
var assetStackedChart;
var cashStackedChart;
var assetLineRaceChart;
var cashLineRaceChart;
var assetBarRaceChart;
var cashBarRaceChart;
let chartControllers = {};
let activeCharts = {};

export function updateCharts() {

    const assetData = history.map(h => ({
        round: h.round,
        values: h.snapshot.map(s => s.totalAsset)
    }));

    const cashData = history.map(h => ({
        round: h.round,
        values: h.snapshot.map(s => s.cash)
    }));

    renderChart('assetChart', '总资产', assetData);
    renderChart('cashChart', '现金', cashData);
    renderStackedChart('asset-stacked-chart', '资产堆叠面积图', assetData);
    renderStackedChart('cash-stacked-chart', '现金堆叠面积图', cashData);
    assetLineRaceChart = renderLineRaceChart('asset-line-race-chart', '总资产折线动态图', assetData);
    cashLineRaceChart = renderLineRaceChart('cash-line-race-chart', '现金折线动态图', cashData);
    assetBarRaceChart = renderBarRaceChart('asset-bar-race-chart', '总资产柱状动态图', assetData);
    cashBarRaceChart = renderBarRaceChart('cash-bar-race-chart', '现金柱状动态图', cashData);
}

export function renderChart(canvasId, label, data) {
    var chartDom = document.getElementById(canvasId);
    var myChart = echarts.init(chartDom);
    var option;

    const playersData = players.map(player => {
        return {
            name: player.name,
            type: 'line',
            itemStyle: {
                color: player.color // 使用玩家的颜色
            },
            data: data.map(d => {
                const value = d.values[players.indexOf(player)];
                return value < 0 ? 0 : value; // 如果值小于0，则返回0
            }),
            smooth: true
        };
    });

    option = {
        title: {
            text: label
        },
        legend: {
            data: players.map(player => player.name)
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.map(d => `第${d.round}轮`)
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(value) {
                    if (value >= 1000) {
                        return (value / 1000).toFixed(1) + 'M'; // 百万级别
                    } else if (value >= 1000) {
                        return (value / 1).toFixed(1) + 'k'; // 千级别
                    } else {
                        return value.toString(); // 小于千的数值
                    }
                }
            }
        },
        series: playersData
    };

    
    option && myChart.setOption(option);
    // 响应式处理
    window.addEventListener('resize', () => myChart.resize());
}

function calculatePolynomialTrendLine(data) {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data;

    // 使用二次多项式拟合
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumX3 = x.reduce((a, b) => a + b * b * b, 0);
    const sumX4 = x.reduce((a, b) => a + b * b * b * b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2Y = x.reduce((sum, xi, i) => sum + xi * xi * y[i], 0);

    const denominator = n * (sumX2 * sumX4 - sumX3 * sumX3) - sumX * (sumX * sumX4 - sumX2 * sumX3) + sumX2 * (sumX * sumX3 - sumX2 * sumX2);
    const a = (sumY * (sumX2 * sumX4 - sumX3 * sumX3) - sumX * (sumXY * sumX4 - sumX3 * sumX2Y) + sumX2 * (sumXY * sumX3 - sumX2 * sumX2Y)) / denominator;
    const b = (n * (sumXY * sumX4 - sumX3 * sumX2Y) - sumY * (sumX * sumX4 - sumX2 * sumX3) + sumX2 * (sumX * sumX2Y - sumXY * sumX2)) / denominator;
    const c = (n * (sumX2 * sumX2Y - sumXY * sumX3) - sumX * (sumX * sumX2Y - sumXY * sumX2) + sumY * (sumX * sumX3 - sumX2 * sumX2)) / denominator;

    return x.map(xi => a + b * xi + c * xi * xi);
}

function renderStackedChart(canvasId, label, data) {
    var chartDom = document.getElementById(canvasId);
    var myChart = echarts.init(chartDom);
    var option;

    const playersData = players.map(player => {
        return {
            name: player.name,
            type: 'line',
            stack: 'Total', // 设置堆叠属性
            areaStyle: {}, // 添加面积样式
            emphasis: {
                focus: 'series'
            },
            itemStyle: {
                color: player.color // 使用玩家的颜色
            },
            data: data.map(d => {
                const value = d.values[players.indexOf(player)];
                return value < 0 ? 0 : value; // 如果值小于0，则返回0
            }),
            smooth: true
        };
    });

    option = {
        title: {
            text: label
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: players.map(player => player.name)
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.map(d => `第${d.round}轮`)
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(value) {
                    if (value >= 1000) {
                        return (value / 1000).toFixed(1) + 'M'; // 百万级别
                    } else if (value >= 1000) {
                        return (value / 1).toFixed(1) + 'k'; // 千级别
                    } else {
                        return value.toString(); // 小于千的数值
                    }
                }
            }
        },
        series: playersData
    };

    
    option && myChart.setOption(option);
    // 响应式处理
    window.addEventListener('resize', () => myChart.resize());
}

function renderLineRaceChart(canvasId, label, data) {
    // 清理已有实例
    if (chartControllers[canvasId]) {
        chartControllers[canvasId].destroy();
        delete chartControllers[canvasId];
    }

    const chartDom = document.getElementById(canvasId);
    var myChart = echarts.init(chartDom);
    var currentOption;
    var mediaRecorder;

    // 创建控制器对象
    const controller = {
        chart: myChart,
        animationTimer: null,
        resizeHandler: null,
        destroy: function() {
            clearTimeout(this.animationTimer);
            window.removeEventListener('resize', this.resizeHandler);
            this.chart.dispose();
        }
    };

    // 转换原始数据为dataset格式
    const datasetSource = [
        ['round', 'player', 'value']
    ];
    data.forEach(d => {
        players.forEach((player, index) => {
            let value = d.values[index];
            value = value < 0 ? 0 : value;
            datasetSource.push([d.round, player.name, value]);
        });
    });

    // 创建过滤数据集
    const datasetWithFilters = [];
    players.forEach(player => {
        const datasetId = `dataset_${player.name}`;
        datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: 'dataset_raw',
            transform: {
                type: 'filter',
                config: {
                    and: [{ dimension: 'player', '=': player.name }]
                }
            }
        });
    });

    // 创建系列配置
    const seriesList = players.map(player => ({
        type: 'line',
        datasetId: `dataset_${player.name}`,
        showSymbol: false,
        name: player.name,
        endLabel: {
            show: true,
            formatter: params => {
                const value = params.value[2]; // 假设 value 是第二个元素
                let formattedValue;
                if (value >= 1000) {
                    formattedValue = (value / 1000).toFixed(1) + 'M'; // 百万级别
                } else if (value >= 1000) {
                    formattedValue = (value / 1).toFixed(1) + 'k'; // 千级别
                } else {
                    formattedValue = value.toString(); // 小于千的数值
                }
                return `${params.seriesName}: ${formattedValue}`;
            }
        },
        labelLayout: {
            moveOverlap: 'shiftY'
        },
        emphasis: {
            focus: 'series'
        },
        encode: {
            x: 'round',
            y: 'value',
            itemName: 'round',
            tooltip: ['value']
        },
        itemStyle: {
            color: player.color
        },
        smooth: true
    }));

    // 配置图表选项
    const option = {
        animationDuration: 5000,
        animationEasing: 'cubicInOut',
        animationThreshold: 2000,
        dataset: [{
                id: 'dataset_raw',
                source: datasetSource
            },
            ...datasetWithFilters
        ],
        title: {
            text: label,
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            order: 'valueDesc',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: players.map(p => p.name),
            top: 30
        },
        grid: {
            top: 100,
            right: 140,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            name: '轮次',
            nameLocation: 'middle',
            axisLabel: {
                formatter: val => `第${val}轮`
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(value) {
                    if (value >= 1000) return (value / 1000).toFixed(1) + 'M';
                    if (value >= 1) return (value / 1).toFixed(1) + 'k';
                    return value;
                }
            }
        },
        series: seriesList
    };

    myChart.on('finished', () => {
        console.log('Animation finished');
    });

    controller.resizeHandler = () => myChart.resize();
    chartControllers[canvasId] = controller;

    myChart.setOption(option);
    window.addEventListener('resize', myChart.resize);

    return {
        stop: () => controller.destroy(),
        restart: () => myChart.setOption(option),
    }
}

function renderBarRaceChart(canvasId, label, data) {
    // 清理已有实例
    if (activeCharts[canvasId]) {
        activeCharts[canvasId].chart.dispose();
        clearInterval(activeCharts[canvasId].timer);
        delete activeCharts[canvasId];
    }
    const chartDom = document.getElementById(canvasId);
    var myChart = echarts.init(chartDom);
    // if (canvasId === 'asset-bar-race-chart') {
    //     assetBarRaceChart = echarts.init(chartDom);
    //     myChart = assetBarRaceChart;
    // }
    // else {
    //     cashBarRaceChart = echarts.init(chartDom);
    //     myChart = cashBarRaceChart;
    // }
    activeCharts[canvasId] = { 
        chart: myChart,
        timer: null
    };

    const updateFrequency = 500;

    // 生成颜色映射
    const colorMap = players.reduce((acc, cur) => {
        acc[cur.name] = cur.color;
        return acc;
    }, {});

    // 数据预处理
    const sortedData = [...data].sort((a, b) => a.round - b.round);
    const initialSeriesData = players.map((p, idx) => ({
        name: p.name,
        value: Math.max(0, sortedData[0].values[idx])
    })).sort((a, b) => b.value - a.value);

    // 核心配置项
    const option = {
        title: { text: label, left: 'center' },
        grid: { top: 100, bottom: 50, left: 200, right: 50 },
        xAxis: {
            type: 'value',
            max: 'dataMax',
            axisLabel: {
                formatter: value => {
                    if (value >= 1e3) return `${(value/1e3).toFixed(1)}M`;
                    if (value >= 1) return `${(value/1).toFixed(1)}k`;
                    return value;
                }
            }
        },
        yAxis: {
            type: 'category',
            inverse: true,
            axisLabel: { fontSize: 16 },
            animationDuration: 200
        },
        series: [{
            type: 'bar',
            realtimeSort: true,
            data: initialSeriesData,
            encode: { x: 'value', y: 'name' }, // 关键修复点
            label: {
                show: true,
                position: 'right',
                formatter: params => {
                    const value = params.value;
                    if (value >= 1e3) {
                        return `${(value / 1e3).toFixed(1)}M`; // 百万级别
                    } else if (value >= 1) {
                        return `${(value / 1).toFixed(1)}k`; // 千级别
                    } else {
                        return value.toString(); // 小于千的数值
                    }
                },
                valueAnimation: true,
                fontSize: 14
            },
            itemStyle: {
                color: params => colorMap[params.data.name] || '#5470c6'
            },
            barWidth: 20
        }],
        animationDurationUpdate: updateFrequency,
        graphic: {
            elements: [{
                type: 'text',
                right: 100,
                bottom: 60,
                style: {
                    text: `第${sortedData[0].round}轮`,
                    font: 'bolder 60px monospace',
                    fill: 'rgba(100,100,100,0.25)'
                }
            }]
        }
    };

    myChart.setOption(option);

    // 动态更新逻辑
    let currentIndex = 1;
    const timer = setInterval(() => {
        if (currentIndex >= sortedData.length) {
            clearInterval(timer);
            return;
        }

        const currentRound = sortedData[currentIndex];
        const newData = players
            .map((p, idx) => ({
                name: p.name,
                value: Math.max(0, currentRound.values[idx])
            }))
            .sort((a, b) => b.value - a.value);

        myChart.setOption({
            yAxis: { data: newData.map(d => d.name) },
            series: [{
                data: newData,
                label: {
                    formatter: params => {
                        const value = params.value;
                        if (value >= 1e3) {
                            return `${(value / 1e3).toFixed(1)}M`; // 百万级别
                        } else if (value >= 1) {
                            return `${(value / 1).toFixed(1)}k`; // 千级别
                        } else {
                            return value.toString(); // 小于千的数值
                        }
                    },
                }
            }],
            graphic: {
                elements: [{
                    style: { text: `第${currentRound.round}轮` }
                }]
            }
        });

        currentIndex++;
    }, updateFrequency);

    activeCharts[canvasId].timer = timer;

    myChart.on('dispose', () => {
        clearInterval(timer);
        window.removeEventListener('resize', () => myChart.resize());
    });

    // 响应式处理
    window.addEventListener('resize', () => myChart.resize());

    return {
        stop: () => {
            clearInterval(timer);
            myChart.dispose();
        },
        restart: () => {
            currentIndex = 0;
            myChart.setOption(option);
        }
    }
}

export function replayCharts() {
    assetLineRaceChart.restart();
    cashLineRaceChart.restart();
    assetBarRaceChart.restart();
    cashBarRaceChart.restart();
}